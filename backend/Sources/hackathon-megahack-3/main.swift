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

// MARK: - Configuração do CORS
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

// MARK: - Endpoit para o fluxo de somar os pontos de um qrcode gerado pela lixeira
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
        let database = try DatabaseSettings().getDB(reset: false)
        
        try database.transaction ({
            if let qrcode = try QRCode.select(database: database, uuid: uuid) {
                let points = qrcode.points
                
                if qrcode.valid {
                    if let user = try User.getOne(database: database, request: request, response: response, id: id) {
                        user.points += points
                        let _ = try User.update(database: database, request: request, response: response, record: user)
                        
                        // Comentado para deixar os QRCodes gerados validos sempre
                        // qrcode.valid = false
                        // let _ = try QRCode.update(database: database, request: request, response: response, record: qrcode)
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
            } else {
                response
                    .setBody(string: "qrcode não encontrado")
                    .completed(status: .badRequest)
                return
            }
        })
    } catch {
        CSLog("\(error)")
        response
            .setBody(string: "error")
            .completed(status: .internalServerError)
    }
    response
        .setBody(string: "ok")
        .completed()
})

// MARK: - Endpoit para o fluxo de comprar e receber os pontos do supermercado
routes.add(method: .post, uri: "/buy", handler: { request, response in
    guard let buy = request.getBodyJSON(Buy.self) else {
        response
            .setBody(string: "error")
            .completed(status: .badRequest)
        return
    }
    
    do {
        let database = try DatabaseSettings().getDB(reset: false)
        
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
            
            if let user = try User.select(database: database, cpf: buy.user_cpf) {
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
        CSLog("\(error)")
        response
            .setBody(string: "error")
            .completed(status: .internalServerError)
    }
    response
        .setBody(string: "ok")
        .completed()
})

// MARK: - Endpoit para o fluxo de gerar um qrcode pela lixeira
routes.add(method: .get, uri: "/recycling", handler: { request, response in
    do {
        let database = try DatabaseSettings().getDB(reset: false)
        
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
        let points = countInt * 5
        
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
        CSLog("\(error)")
        response
            .setBody(string: "error")
            .completed(status: .internalServerError)
    }
})

// MARK: - Endpoit para o fluxo de resetar o banco
func reset() throws {
    let database = try DatabaseSettings().getDB(reset: true)
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
    try Recycle.createTable(database: database)
    try Card.createTable(database: database)
}

routes.add(method: .get, uri: "/reset", handler: { request, response in
    do {
        try reset()
    } catch {
        CSLog("\(error)")
        response.completed(status: .internalServerError)
    }
    response.completed()
})

// MARK: - Endpoit para o fluxo de autenticação
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
        let exp = timeInterval + CSTimeIntervalType.hour(999).totalSeconds
        let payload = Payload(sub: 0, exp: exp, iat: timeInterval)
        
        do {
            let token = try CSToken(payload: payload)
            
            try response
                .setBody(json: token)
                .addHeader(.contentType, value: "application/json")
                .completed(status: .ok)
        } catch {
            CSLog("\(error)")
            response.completed(status: .internalServerError)
        }
        return
    }
    
    do {
        let database = try DatabaseSettings().getDB(reset: false)
        guard
            let userAuth = try User.select(database: database, email: authenticate.username),
            userAuth.password == authenticate.password
            else {
                response.completed(status: .unauthorized)
                return
        }
        
        let timeInterval = Date.timeInterval
        let exp = timeInterval + CSTimeIntervalType.hour(999).totalSeconds
        let payload = Payload(sub: userAuth.id, exp: exp, iat: timeInterval)
        let token = try CSToken(payload: payload)
        
        try response
            .setBody(json: token)
            .addHeader(.contentType, value: "application/json")
            .completed(status: .ok)
    } catch {
        CSLog("\(error)")
        response.completed(status: .internalServerError)
    }
})

// MARK: - ControllerSwift
routes.add(User.routes(databaseType: DatabaseSettings.self))
routes.add(Goal.routes(databaseType: DatabaseSettings.self))
routes.add(Address.routes(databaseType: DatabaseSettings.self))
routes.add(Category.routes(databaseType: DatabaseSettings.self))
routes.add(Product.routes(databaseType: DatabaseSettings.self))
routes.add(ProductImage.routes(databaseType: DatabaseSettings.self))
routes.add(Advertisement.routes(databaseType: DatabaseSettings.self))
routes.add(QRCode.routes(databaseType: DatabaseSettings.self))
routes.add(Market.routes(databaseType: DatabaseSettings.self))
routes.add(Recipe.routes(databaseType: DatabaseSettings.self))
routes.add(Event.routes(databaseType: DatabaseSettings.self))
routes.add(Recycle.routes(databaseType: DatabaseSettings.self))
routes.add(Card.routes(databaseType: DatabaseSettings.self))

server.addRoutes(routes)

// MARK: - Start server
do {
    CSLog("[INFO] Starting HTTP server on \(server.serverAddress):\(server.serverPort)")
    try server.start()
} catch PerfectError.networkError(let err, let msg){
    CSLog("Network error thrown: \(err) \(msg)")
}
