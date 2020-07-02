import Foundation
import PerfectLib
import PerfectHTTP
import PerfectHTTPServer
import ControllerSwift
import PerfectCRUD
import PerfectSession

// MARK: - Init Server
let server = HTTPServer()
server.serverPort = 8080

SessionConfig.CORS.enabled = true
SessionConfig.CORS.maxAge = 86400
SessionConfig.CORS.acceptableHostnames = ["*"]
SessionConfig.CORS.methods = [.get, .post, .put, .delete, .options]
SessionConfig.CORS.withCredentials = true
SessionConfig.CORS.customHeaders = ["*", "Content-Range", "Timezone-Offset-Header", "Authorization"]

let sessionDriver = SessionMemoryDriver()
server.setRequestFilters([sessionDriver.requestFilter])
server.setResponseFilters([sessionDriver.responseFilter])

// MARK: - Routes
var routes = Routes()
routes.add(method: .get, uri: "/", handler: { request, response in
    response.setBody(string: "Hello world!").completed()
})

routes.add(method: .get, uri: "/recycling/{uuid}", handler: { request, response in
    guard
        let uuid = request.urlVariables["uuid"],
        let user = request.header(HTTPRequestHeader.Name.custom(name: "user")),
        let id = Int(user)
        else {
            response
                .setBody(string: "error")
                .completed(status: .badRequest)
            return
    }
    
    do {
        let database = try DatabaseSettings.getDB(reset: false)
        
        try database.transaction({
            if let qrcode = try QRCode.select(database: database, uuid: uuid) {
                let points = qrcode.points
                
                if qrcode.valid {
                    if var user = try User.getOne(database: database, request: request, response: response, id: id) {
                        user.points += points
                        let _ = try User.update(database: database, request: request, response: response, record: user)
                        
                        qrcode.valid = false
                        let _ = try QRCode.update(database: database, request: request, response: response, record: qrcode)
                    } else {
                        response
                            .setBody(string: "usuário não encontrado")
                            .completed(status: .badRequest)
                        return
                    }
                } else {
                    response
                        .setBody(string: "qrcode já foi usado")
                        .completed(status: .badRequest)
                    return
                }
            }else{
                response
                    .setBody(string: "qrcode não encontrado")
                    .completed(status: .badRequest)
                return
            }
        })
    } catch {
        Log("\(error)")
        response
            .setBody(string: "error")
            .completed(status: .internalServerError)
    }
    response
        .setBody(string: "ok")
        .completed()
})

struct ProductsBuy: Codable {
    var barcode: String
    var amount: Int
}

struct Buy: Codable {
    var market_id: Int
    var products: [ProductsBuy]
    var user_cpf: String
}

routes.add(method: .post, uri: "/buy", handler: { request, response in
    guard let buy = request.getBodyJSON(Buy.self) else {
        response
            .setBody(string: "error")
            .completed(status: .badRequest)
        return
    }
    
    do {
        let database = try DatabaseSettings.getDB(reset: false)
        
        try database.transaction {
            let barcodes = buy.products.map({ $0.barcode })
            let products = try Product.select(database: database, barcodes: barcodes)
            
            var barcodesMapPoints = [String: Int]()
            products.forEach({ product in
                barcodesMapPoints[product.barcode] = product.points
            })
            
            let points = buy.products
                .map({ product -> Int in
                    let points = barcodesMapPoints[product.barcode] ?? 0
                    return points * product.amount
                }).reduce(0, +)
            
            if var user = try User.select(database: database, cpf: buy.user_cpf) {
                user.points += points
                let _ = try User.update(database: database, request: request, response: response, record: user)
            } else {
                response
                    .setBody(string: "usuário não encontrado")
                    .completed(status: .badRequest)
                return
            }
        }
    } catch {
        Log("\(error)")
        response
            .setBody(string: "error")
            .completed(status: .internalServerError)
    }
    response
        .setBody(string: "ok")
        .completed()
})

routes.add(method: .get, uri: "/recycling", handler: { request, response in
    do {
        let database = try DatabaseSettings.getDB(reset: false)
        
        guard
            let count = request.param(name: "count"),
            let countInt = Int(count)
            else {
                response
                    .setBody(string: "error")
                    .completed(status: .badRequest)
                return
        }
        
        let uuid = UUID().uuidString
        let points = countInt * 100
        
        let qrcode = QRCode(id: 0,
                            uuid: uuid,
                            title: "recycling",
                            description: "generated",
                            points: points,
                            valid: true)
        
        let _ = try QRCode.create(database: database, request: request, response: response, record: qrcode)
        
        let tag = "recycling/\(uuid)"
        response
            .appendBody(string: tag)
            .completed()
    } catch {
        Log("\(error)")
        response
            .setBody(string: "error")
            .completed(status: .internalServerError)
    }
})

func reset() throws {
    let database = try DatabaseSettings.getDB(reset: true)
    try User.createTable(database: database)
    try UserAuthenticate.createTable(database: database)
    try Goal.createTable(database: database)
    try Address.createTable(database: database)
    try Category.createTable(database: database)
    try Product.createTable(database: database)
    try ProductImage.createTable(database: database)
    try Advertisement.createTable(database: database)
    try QRCode.createTable(database: database)
    try Market.createTable(database: database)
    try Recipe.createTable(database: database)
    try Event.createTable(database: database)
}

routes.add(method: .get, uri: "/reset", handler: { request, response in
    do {
        try reset()
    } catch {
        Log("\(error)")
        response.completed(status: .internalServerError)
    }
    response.completed()
})

routes.add(method: .options, uri: "/authenticate", handler: { request, response in
    response.completed()
})

routes.add(method: .post, uri: "/authenticate", handler: { request, response in
    guard let authenticate = request.getBodyJSON(Authenticate.self) else {
        response.completed(status: .internalServerError)
        return
    }
    
    if authenticate.username == "admin" && authenticate.password == "admin" {
        let timeInterval = Date.timeInterval
        let exp = timeInterval + TimeIntervalType.hour(999).totalSeconds
        let payload = Payload(sub: 0, exp: exp, iat: timeInterval)
        
        do {
            let token = try Token(payload: payload)
            
            try response
                .setBody(json: token)
                .addHeader(.contentType, value: "application/json")
                .completed(status: .ok)
        } catch {
            Log("\(error)")
            response.completed(status: .internalServerError)
        }
        return
    }
    
    do {
        let database = try DatabaseSettings.getDB(reset: false)
        guard
            let userAuth = try User.select(database: database, email: authenticate.username),
            userAuth.password == authenticate.password.sha256
            else {
                response.completed(status: .unauthorized)
                return
        }
        
        let timeInterval = Date.timeInterval
        let exp = timeInterval + TimeIntervalType.hour(999).totalSeconds
        let payload = Payload(sub: userAuth.id, exp: exp, iat: timeInterval)
        let token = try Token(payload: payload)
        
        try response
            .setBody(json: token)
            .addHeader(.contentType, value: "application/json")
            .completed(status: .ok)
    } catch {
        Log("\(error)")
        response.completed(status: .internalServerError)
    }
})

// MARK: - ControllerSwift
do {
    let database = try DatabaseSettings.getDB(reset: false)
    routes.add(User.routes(database: database))
    routes.add(Goal.routes(database: database))
    routes.add(Address.routes(database: database))
    routes.add(Category.routes(database: database))
    routes.add(Product.routes(database: database))
    routes.add(ProductImage.routes(database: database))
    routes.add(Advertisement.routes(database: database))
    routes.add(QRCode.routes(database: database))
    routes.add(Market.routes(database: database))
    routes.add(Recipe.routes(database: database))
    routes.add(Event.routes(database: database))
} catch {
    Log("\(error)")
}

server.addRoutes(routes)

// MARK: - Start server
do {
    Log("[INFO] Starting HTTP server on \(server.serverAddress):\(server.serverPort)")
    try server.start()
} catch PerfectError.networkError(let err, let msg){
    Log("Network error thrown: \(err) \(msg)")
}
