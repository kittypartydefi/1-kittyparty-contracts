import { log, ethereum, BigInt } from "@graphprotocol/graph-ts"

import {
  Contract,
  KittenAddedToParty,
  KittenCreated,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../generated/Contract/Contract"
import {
KittyLive
} from "../generated/KittyFactory/KittyPartyFactory"
import { KittyPartyController } from "../generated/templates"
import { SKitten, SKittyParty } from "../generated/schema"
import { StageTransition } from "../generated/templates/KittyPartyController/KittyPartyController"

export function handleKittenAddedToParty(event: KittenAddedToParty): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let KittyParty = SKittyParty.load(event.params.KittyParty.toHexString())

  let memberArray:Array<string> = KittyParty.members
  let allMemberArray:Array<string> = KittyParty.allMembers

  memberArray.push(event.params.Kitten.toHexString())
  allMemberArray.push(event.params.Kitten.toHexString())
  
  KittyParty.members = memberArray
  KittyParty.allMembers = allMemberArray
  KittyParty.save()
}

export function handleKittenCreated(event: KittenCreated): void {
  //load or create a Kitten
  let Kitten = SKitten.load(event.params.Kitten.toHexString())
  if (Kitten == null) {
    Kitten = new SKitten(event.params.Kitten.toHexString())
  }
  // Entities can be written to the store with `.save()`
  Kitten.save()
}

export function handleKittenLiveViaFactory(event: KittyLive): void {
  let KittyParty = SKittyParty.load(event.params.kitty.toHexString())
  if (KittyParty == null) {
    KittyParty = new SKittyParty(event.params.kitty.toHexString())
  }
  let allMemberArray:Array<string>
  KittyParty.dateCreated = event.block.timestamp
  //In the following create is where we link the factory created KittyParty
  KittyPartyController.create(event.params.kitty)
  KittyParty.kreator = event.params.kreator.toHexString()
  KittyParty.members = []
  allMemberArray.push(event.params.kreator.toHexString())
  KittyParty.allMembers = allMemberArray
  KittyParty.stage = BigInt.fromI32(0)
  KittyParty.partyName = event.params.kittyPartyName.toString();

  KittyParty.save()
}

export function handleStageTransition(event: StageTransition): void {
  // Save the next stage as the current stage in graph 
  let KittyParty = SKittyParty.load(event.params.party())
  KittyParty.stage = event.params.nextStage;
  KittyParty.save();
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}
