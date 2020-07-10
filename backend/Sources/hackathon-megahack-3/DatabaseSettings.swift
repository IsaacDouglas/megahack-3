//
//  DatabaseSettings.swift
//  hackathon-megahack-3
//
//  Created by Isaac Douglas on 29/06/20.
//

import Foundation
import PerfectCRUD
import PerfectMySQL
import ControllerSwift

#if os(Linux)
let host = "35.247.229.61"
let password = "xyNcim2ahJ1xH8c3"
#else
let host = "localhost"
let password = "1234"
#endif

let DBName = "megahack3"
let user = "root"

final class DatabaseSettings: CSDatabaseProtocol {
    typealias T = MySQLDatabaseConfiguration
    
    func getDB(reset: Bool) throws -> Database<T> {
        if reset {
            let db = Database(configuration: try T(database: DBName,
                                                   host: host,
                                                   username: user,
                                                   password: password))
            
            try db.sql("DROP DATABASE \(DBName)")
            try db.sql("CREATE DATABASE \(DBName) DEFAULT CHARACTER SET utf8mb4")
        }
        return Database(configuration: try T(database: DBName,
                                             host: host,
                                             username: user,
                                             password: password))
    }
}
