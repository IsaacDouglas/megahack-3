//
//  User.swift
//  hackathon-megahack-3
//
//  Created by Isaac Douglas on 29/06/20.
//

import Foundation
import ControllerSwift
import PerfectCRUD

struct User: Codable {
    var id: Int
    var name: String
    var email: String
    var cpf: String
    var password: String
    var admin: Bool
    var points: Int
    var image: String?
    var phone: String?
    
    init(from decoder: Decoder) throws {
        let values = try decoder.container(keyedBy: CodingKeys.self)
        self.id = (try? values.decode(Int.self, forKey: .id)) ?? 0
        self.name = try values.decode(String.self, forKey: .name)
        self.email = try values.decode(String.self, forKey: .email)
        self.cpf = try values.decode(String.self, forKey: .cpf)
        self.password = try values.decode(String.self, forKey: .password)
        self.admin = try values.decode(Bool.self, forKey: .admin)
        self.points = (try? values.decode(Int.self, forKey: .points)) ?? 0
        self.image = try? values.decode(String.self, forKey: .image)
        self.phone = try? values.decode(String.self, forKey: .phone)
    }
}

extension User: ControllerSwiftProtocol {
    static func createTable<T: DatabaseConfigurationProtocol>(database: Database<T>) throws {
        try database.sql("DROP TABLE IF EXISTS \(Self.CRUDTableName)")
        try database.sql("""
            CREATE TABLE \(Self.CRUDTableName) (
            id INTEGER AUTO_INCREMENT PRIMARY KEY UNIQUE,
            name VARCHAR(128) NOT NULL,
            email VARCHAR(128) NOT NULL UNIQUE,
            cpf VARCHAR(20) NOT NULL UNIQUE,
            password CHAR(64) NOT NULL,
            admin BOOLEAN NOT NULL CHECK (admin IN (0,1)),
            points INTEGER NOT NULL,
            image TEXT,
            phone TEXT
            )
            """)
    }
    
    static func select<T: DatabaseConfigurationProtocol>(database: Database<T>, email: String) throws -> User? {
        let table = database.table(Self.self)
        return try table.where(\User.email == email).first()
    }
    
    static func select<T: DatabaseConfigurationProtocol>(database: Database<T>, cpf: String) throws -> User? {
        let table = database.table(Self.self)
        return try table.where(\User.cpf == cpf).first()
    }
}
