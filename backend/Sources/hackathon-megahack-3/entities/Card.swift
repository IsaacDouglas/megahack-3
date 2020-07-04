//
//  Card.swift
//  hackathon-megahack-3
//
//  Created by Isaac Douglas on 04/07/20.
//

import Foundation
import ControllerSwift
import PerfectCRUD

struct Card: Codable {
    var id: Int
    var user_id: Int
    var nome_titular: String
    var card_number: String
    var cvv: String
    var validade: String
    
    init(from decoder: Decoder) throws {
        let values = try decoder.container(keyedBy: CodingKeys.self)
        self.id = (try? values.decode(Int.self, forKey: .id)) ?? 0
        self.user_id = try values.decode(Int.self, forKey: .user_id)
        self.nome_titular = try values.decode(String.self, forKey: .nome_titular)
        self.card_number = try values.decode(String.self, forKey: .card_number)
        self.cvv = try values.decode(String.self, forKey: .cvv)
        self.validade = try values.decode(String.self, forKey: .validade)
    }
}

extension Card: ControllerSwiftProtocol {
    static func createTable<T: DatabaseConfigurationProtocol>(database: Database<T>) throws {
        try database.sql("DROP TABLE IF EXISTS \(Self.CRUDTableName)")
        try database.sql("""
            CREATE TABLE \(Self.CRUDTableName) (
            id INTEGER AUTO_INCREMENT PRIMARY KEY UNIQUE,
            user_id INTEGER NOT NULL,
            nome_titular TEXT NOT NULL,
            card_number TEXT NOT NULL,
            cvv TEXT NOT NULL,
            validade TEXT NOT NULL
            )
            """)
    }
    
}
