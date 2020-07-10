//
//  Payload.swift
//  hackathon-megahack-3
//
//  Created by Isaac Douglas on 29/06/20.
//

import Foundation
import ControllerSwift

struct Payload: CSPayloadProtocol {
    public var sub: Int
    public var exp: CLong
    public var iat: CLong
    
    func reload() -> Payload {
        let exp = self.exp + CSTimeIntervalType.hour(999).totalSeconds
        return .init(sub: self.sub, exp: exp, iat: self.iat)
    }
}
