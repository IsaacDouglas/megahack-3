//
//  Buy.swift
//  hackathon-megahack-3
//
//  Created by Isaac Douglas on 05/07/20.
//

import Foundation

struct Buy: Codable {
    var market_id: Int
    var products: [ProductsBuy]
    var user_cpf: String
}
