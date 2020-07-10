//
//  Category.swift
//  hackathon-megahack-3
//
//  Created by Isaac Douglas on 30/06/20.
//

import Foundation
import ControllerSwift
import PerfectCRUD
import PerfectHTTP

final class Category: Codable {
    var id: Int
    var title: String
    var subtitle: String?
    var products: [Product]?
    
    init(from decoder: Decoder) throws {
        let values = try decoder.container(keyedBy: CodingKeys.self)
        self.id = (try? values.decode(Int.self, forKey: .id)) ?? 0
        self.title = try values.decode(String.self, forKey: .title)
        self.subtitle = try? values.decode(String.self, forKey: .subtitle)
    }
}

extension Category: ControllerSwiftProtocol {
    static func createTable<T: DatabaseConfigurationProtocol>(database: Database<T>) throws {
        try database.sql("DROP TABLE IF EXISTS \(Self.CRUDTableName)")
        try database.sql("""
            CREATE TABLE \(Self.CRUDTableName) (
            id INTEGER AUTO_INCREMENT PRIMARY KEY UNIQUE,
            title TEXT NOT NULL,
            subtitle TEXT
            )
            """)
    }
    
    static func getOne<T: DatabaseConfigurationProtocol>(database: Database<T>, request: HTTPRequest, response: HTTPResponse, id: Int) throws -> Category? {
        let table = database.table(Category.self)
        let category = try table.where(\Category.id == id).first()
        let tableProducts = database.table(Product.self)
        let products = try tableProducts.where(\Product.category_id == id).select().map({ $0 })
        category?.products = products
        return category
    }
    
    static func getList<T: DatabaseConfigurationProtocol>(database: Database<T>, request: HTTPRequest, response: HTTPResponse, sort: CSSort?, range: CSRange?, filter: [String: Any]?) throws -> ([Category], Int) {
        let count = try database.table(Category.self).count()
        
        var list = [String]()
        
        if let filter = filter {
            if let ids = filter["ids"] as? [Int] {
                let joined = ids.map({ "\($0)" }).joined(separator: ", ")
                list.append("WHERE id IN (\(joined))")
            }
        }
        
        if let sort = sort {
            list.append("ORDER BY \(sort.field) \(sort.order.rawValue)")
        }
        
        if let range = range {
            list.append("LIMIT \(range.limit) OFFSET \(range.offset)")
        }
        
        let select = try database.sql("SELECT * FROM \(Category.CRUDTableName) \(list.joined(separator: " "))", Category.self)
        let tableProducts = database.table(Product.self)
        
        try database.transaction {
            for category in select {
                let products = try tableProducts.where(\Product.category_id == category.id).select().map({ $0 })
                category.products = products
            }
        }
        return (select, count)
    }
}
