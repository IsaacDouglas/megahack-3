//
//  QRCode.swift
//  hackathon-megahack-3
//
//  Created by Isaac Douglas on 30/06/20.
//

import Foundation
import ControllerSwift
import PerfectCRUD

final class QRCode: Codable {
    var id: Int
    var uuid: String
    var title: String
    var description: String
    var points: Int
    var valid: Bool
    
    init(from decoder: Decoder) throws {
        let values = try decoder.container(keyedBy: CodingKeys.self)
        self.id = (try? values.decode(Int.self, forKey: .id)) ?? 0
        self.uuid = (try? values.decode(String.self, forKey: .uuid)) ?? UUID().uuidString
        self.title = try values.decode(String.self, forKey: .title)
        self.description = try values.decode(String.self, forKey: .description)
        self.points = try values.decode(Int.self, forKey: .points)
        self.valid = try values.decode(Bool.self, forKey: .valid)
    }
    
    init(id: Int, uuid: String, title: String, description: String, points: Int, valid: Bool) {
        self.id = id
        self.uuid = uuid
        self.title = title
        self.description = description
        self.points = points
        self.valid = valid
    }
}

extension QRCode: ControllerSwiftProtocol {
    static func createTable<T: DatabaseConfigurationProtocol>(database: Database<T>) throws {
        try database.sql("DROP TABLE IF EXISTS \(Self.CRUDTableName)")
        try database.sql("""
            CREATE TABLE \(Self.CRUDTableName) (
            id INTEGER AUTO_INCREMENT PRIMARY KEY UNIQUE,
            uuid CHAR(36) NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            points INTEGER NOT NULL,
            valid BOOLEAN NOT NULL CHECK (valid IN (0,1))
            )
            """)
    }
    
    static func select<T: DatabaseConfigurationProtocol>(database: Database<T>, uuid: String) throws -> QRCode? {
        let table = database.table(Self.self)
        return try table.where(\QRCode.uuid == uuid).first()
    }
}
