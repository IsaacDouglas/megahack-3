//
//  Product.swift
//  hackathon-megahack-3
//
//  Created by Isaac Douglas on 30/06/20.
//

import Foundation
import ControllerSwift
import PerfectCRUD

struct Product: Codable {
    var id: Int
    var category_id: Int
    var barcode: String
    var name: String
    var description: String
    var abv: String?
    var family: String?
    var price: String
    var points: Int
    var ingredients_details: String?
    var allergic_information: String?
    var milliliter: Int?
    var image: String?
    
    init(from decoder: Decoder) throws {
        let values = try decoder.container(keyedBy: CodingKeys.self)
        self.id = (try? values.decode(Int.self, forKey: .id)) ?? 0
        self.category_id = try values.decode(Int.self, forKey: .category_id)
        self.name = try values.decode(String.self, forKey: .name)
        self.barcode = try values.decode(String.self, forKey: .barcode)
        self.description = try values.decode(String.self, forKey: .description)
        self.abv = try? values.decode(String.self, forKey: .abv)
        self.family = try? values.decode(String.self, forKey: .family)
        self.price = try values.decode(String.self, forKey: .price)
        self.points = try values.decode(Int.self, forKey: .points)
        self.ingredients_details = try? values.decode(String.self, forKey: .ingredients_details)
        self.allergic_information = try? values.decode(String.self, forKey: .allergic_information)
        self.milliliter = try? values.decode(Int.self, forKey: .milliliter)
        self.image = try? values.decode(String.self, forKey: .image)
    }
}

extension Product: ControllerSwiftProtocol {
    static func createTable<T: DatabaseConfigurationProtocol>(database: Database<T>) throws {
        try database.sql("DROP TABLE IF EXISTS \(Self.CRUDTableName)")
        try database.sql("""
            CREATE TABLE \(Self.CRUDTableName) (
            id INTEGER AUTO_INCREMENT PRIMARY KEY UNIQUE,
            category_id INTEGER NOT NULL,
            barcode TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            abv TEXT,
            family TEXT,
            price TEXT NOT NULL,
            points INTEGER NOT NULL,
            ingredients_details TEXT,
            allergic_information TEXT,
            milliliter INTEGER,
            image TEXT
            )
            """)
    }
    
    static func select<T: DatabaseConfigurationProtocol>(database: Database<T>, barcodes: [String]) throws -> [Product] {
        let table = database.table(Product.self)
        return try table.where(\Product.barcode ~ barcodes).select().map({ $0 })
    }
}
