// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class SKitten extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save SKitten entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save SKitten entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("SKitten", id.toString(), this);
    }
  }

  static load(id: string): SKitten | null {
    return changetype<SKitten | null>(store.get("SKitten", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get KittyParties(): Array<string> {
    let value = this.get("KittyParties");
    return value!.toStringArray();
  }

  set KittyParties(value: Array<string>) {
    this.set("KittyParties", Value.fromStringArray(value));
  }
}

export class SKittyParty extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("partyName", Value.fromString(""));
    this.set("members", Value.fromStringArray(new Array(0)));
    this.set("allMembers", Value.fromStringArray(new Array(0)));
    this.set("kreator", Value.fromString(""));
    this.set("dateCreated", Value.fromBigInt(BigInt.zero()));
    this.set("stage", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save SKittyParty entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save SKittyParty entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("SKittyParty", id.toString(), this);
    }
  }

  static load(id: string): SKittyParty | null {
    return changetype<SKittyParty | null>(store.get("SKittyParty", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get partyName(): string {
    let value = this.get("partyName");
    return value!.toString();
  }

  set partyName(value: string) {
    this.set("partyName", Value.fromString(value));
  }

  get members(): Array<string> {
    let value = this.get("members");
    return value!.toStringArray();
  }

  set members(value: Array<string>) {
    this.set("members", Value.fromStringArray(value));
  }

  get allMembers(): Array<string> {
    let value = this.get("allMembers");
    return value!.toStringArray();
  }

  set allMembers(value: Array<string>) {
    this.set("allMembers", Value.fromStringArray(value));
  }

  get kreator(): string {
    let value = this.get("kreator");
    return value!.toString();
  }

  set kreator(value: string) {
    this.set("kreator", Value.fromString(value));
  }

  get dateCreated(): BigInt {
    let value = this.get("dateCreated");
    return value!.toBigInt();
  }

  set dateCreated(value: BigInt) {
    this.set("dateCreated", Value.fromBigInt(value));
  }

  get stage(): BigInt {
    let value = this.get("stage");
    return value!.toBigInt();
  }

  set stage(value: BigInt) {
    this.set("stage", Value.fromBigInt(value));
  }
}
