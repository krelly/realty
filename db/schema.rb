# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160426101116) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "apartment_photos", force: :cascade do |t|
    t.string   "photo"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "apartment_id"
  end

  create_table "apartments", force: :cascade do |t|
    t.text     "description"
    t.integer  "floor"
    t.decimal  "price",        precision: 8, scale: 2
    t.integer  "rooms"
    t.decimal  "area",         precision: 7, scale: 2
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.float    "latitude"
    t.float    "longitude"
    t.string   "address"
    t.integer  "total_floors"
    t.decimal  "living_area",  precision: 8, scale: 2
  end

  add_index "apartments", ["latitude", "longitude"], name: "index_apartments_on_latitude_and_longitude", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.string   "password_digest"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

end
