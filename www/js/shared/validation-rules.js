// Validation
// https://validatejs.org/

// these are related to the tables in server/sql
// and are used server and client side

// General shared validation rules

if (typeof app === "undefined") {
    var app = {};
}

app.validationRules = {

    // for sequence id's such as id_store, id_adress, updated_by etc.
    _sequence_id: { presence: true, numericality: { onlyInteger: true, greaterThan: 0 }},
    _sequence_id_optional: { numericality: { onlyInteger: true, greaterThan: 0 }},

    _email:                 { presence: true, email: true, length: { minimum: 3, maximum: 256 }},
    _email_optional:        { email: true, length: { minimum: 3, maximum: 256 }},
    _phone_number:          { presence: true, length: { minimum: 3, maximum: 32 }},
    _phone_number_optional: { length: { minimum: 3, maximum: 32 }},
    _url_link:              { presence: true, length: { maximum: 256 }},
    _url_link_optional:     { length: { maximum: 256 }},
    _bit:                   { presence: true, numericality: { onlyInteger: true, greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1 }},
    _bit_optional:          { numericality: { onlyInteger: true, greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1 }},
    _notes_optional:        { length: { maximum: 256 }},
    _price:                 { presence: true, numericality: { greaterThanOrEqualTo: 0 }},
    _price_optional:        { numericality: { greaterThanOrEqualTo: 0 }},
    _quantity:              { presence: true, numericality: { onlyInteger: true, greaterThan: 0 }},
    _latitude_optional:     { numericality: { greaterThanOrEqualTo: 0 }},
    _longitude_optional:    { numericality: { greaterThanOrEqualTo: 0 }},


    // These groups of validation things match the columns in the SQL tables
    // SQL table columns that aren't here are using the generic values above

    _addresses_street_address:               { presence: true, length: { maximum: 256 }},

    _people_first_name:                      { presence: true, length: { minimum: 2, maximum: 45 }},
    _people_first_name_optional:             { length: { minimum: 2, maximum: 45 }},
    _people_last_name:                       { presence: true, length: { minimum: 2, maximum: 45 }},
    _people_last_name_optional:              { length: { minimum: 2, maximum: 45 }},
    _people_password:                        { presence: true, length: { minimum: 3, maximum: 64 }},
    _people_reset_password_token:            { presence: true, length: 64 },
    _people_reset_password_token_optional:   { presence: true, length: 64 },
    _people_jwt:                             { presence: true, length: { minimum: 30, maximum: 512 }},
    _people_jwt_optional:                    { length: { minimum: 30, maximum: 512 }},
    _people_verification_token:              { presence: true, length: 64 },

    _postcodes_postcode:                     { presence: true, length: { minimum: 1, maximum: 6 }},
    _postcodes_suburb:                       { presence: true, length: { minimum: 1, maximum: 64 }},
    _postcodes_state:                        { presence: true, length: { minimum: 1, maximum: 32 }},

    _business_hours_day:                     { presence: true, numericality: { onlyInteger: true, greaterThan: 0, lessThan: 8 }},
    _business_hours_opens:                   { presence: true, length: { maximum: 8 }},
    _business_hours_closes:                  { presence: true, length: { maximum: 8 }},

    _reviews_title:                          { presence: true, length: { minimum: 2, maximum: 128 }},
    _reviews_review_optional:                { length: { maximum: 512 }},
    _reviews_rating:                         { presence: true, numericality: { onlyInteger: true, greaterThan: 0, lessThan: 6 }},

    _stores_name:                            { presence: true, length: { maximum: 512 }},
    _stores_description_optional:            { length: { maximum: 1024 }},
    _stores_abn:                             { presence: true, length: { minimum: 10, maximum: 32 }},
    _stores_bank_name:                       { presence: true, length: { minimum: 2, maximum: 128 }},
    _stores_bank_bsb:                        { presence: true, length: { minimum: 6, maximum: 16 }},
    _stores_bank_account_name:               { presence: true, length: { minimum: 2, maximum: 128 }},
    _stores_bank_account_number:             { presence: true, length: { minimum: 2, maximum: 32 }},
    _stores_hours:                           { presence: true, length: { minimum: 4, maximum: 5 }},

    _product_extras_name:                    { presence: true, length: { maximum: 128 }},

    _product_options_name:                   { presence: true, length: { maximum: 128 }},

    _products_name:                          { presence: true, length: { maximum: 128 }},
    _products_description_optional:          { length: { maximum: 256 }},

    _order_products_customer_notes_optional: { length: { maximum: 256 }},

    _orders_notes_optional:                  { length: { maximum: 256 }},
    _orders_expiry:                          { presence: true, datetime: true }, // TODO: does this work

    _transactions_commission:                { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } }, // TODO : is 1000 ok
    _transactions_processing_fee:            { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } },

}







// These validation objects below use the values from above

// -------- Auth route validation --------



app.validationRules.login = {
    email: app.validationRules._email,
    password: app.validationRules._people_password
}

app.validationRules.storeLogin = {
    email: app.validationRules._email,
    password: app.validationRules._people_password
}

app.validationRules.createUser = {
    first_name: app.validationRules._people_first_name,
    last_name: app.validationRules._people_last_name,
    email: app.validationRules._email,
    password: app.validationRules._people_password,
    confirmPassword: { equality: "password" }
}

app.validationRules.verifyAccount = {
    email: app.validationRules._email,
    password: app.validationRules._people_password,
    verification_token: app.validationRules._people_verification_token
}

app.validationRules.logout = {
    jwt: app.validationRules._people_jwt
}

app.validationRules.sendRegistrationEmail = { email: app.validationRules._email }

app.validationRules.forgotPassword = { email: app.validationRules._email }

app.validationRules.resetPassword = {
    email: app.validationRules._people_email,
    password: app.validationRules._people_password,
    confirmPassword: { equality: "password" },
    reset_password_token: app.validationRules._people_reset_password_token
}

app.validationRules.checkJwt = {
    jwt: app.validationRules._people_jwt
}




// -------- Store route validation --------

app.validationRules.createStore = {
    postcode: app.validationRules._postcodes_postcode,
    suburb: app.validationRules._postcodes_suburb,
    street_address: app.validationRules._addresses_street_address,

    first_name: app.validationRules._people_first_name,
    last_name: app.validationRules._people_last_name,
    phone_number_user: app.validationRules._phone_number,
    email_user: app.validationRules._email,
    password: app.validationRules._people_password,

    name: app.validationRules._stores_name,
    abn: app.validationRules._stores_abn,
    internal_notes_store: app.validationRules._notes_optional
}


app.validationRules.updateStore = {
    first_name: app.validationRules._people_first_name,
    last_name: app.validationRules._people_last_name,
    email_user: app.validationRules._email,
}

app.validationRules.updateLogo = {
    id_store: app.validationRules._sequence_id
}

app.validationRules.deleteStore = {
	id_store: app.validationRules._sequence_id
}


app.validationRules.storeUpdateBankDetails = {
    bank_name: app.validationRules._stores_bank_name,
    bank_bsb: app.validationRules._stores_bank_bsb,
    bank_account_name: app.validationRules._stores_bank_account_name,
    bank_account_number: app.validationRules._stores_bank_account_number
}

app.validationRules.storeUpdateHours = {
    hours_mon_dinein_open: app.validationRules._stores_hours,
    hours_tue_dinein_open: app.validationRules._stores_hours,
    hours_wed_dinein_open: app.validationRules._stores_hours,
    hours_thu_dinein_open: app.validationRules._stores_hours,
    hours_fri_dinein_open: app.validationRules._stores_hours,
    hours_sat_dinein_open: app.validationRules._stores_hours,
    hours_sun_dinein_open: app.validationRules._stores_hours,
    hours_mon_dinein_close: app.validationRules._stores_hours,
    hours_tue_dinein_close: app.validationRules._stores_hours,
    hours_wed_dinein_close: app.validationRules._stores_hours,
    hours_thu_dinein_close: app.validationRules._stores_hours,
    hours_fri_dinein_close: app.validationRules._stores_hours,
    hours_sat_dinein_close: app.validationRules._stores_hours,
    hours_sun_dinein_close: app.validationRules._stores_hours,
    hours_mon_delivery_open: app.validationRules._stores_hours,
    hours_tue_delivery_open: app.validationRules._stores_hours,
    hours_wed_delivery_open: app.validationRules._stores_hours,
    hours_thu_delivery_open: app.validationRules._stores_hours,
    hours_fri_delivery_open: app.validationRules._stores_hours,
    hours_sat_delivery_open: app.validationRules._stores_hours,
    hours_sun_delivery_open: app.validationRules._stores_hours,
    hours_mon_delivery_close: app.validationRules._stores_hours,
    hours_tue_delivery_close: app.validationRules._stores_hours,
    hours_wed_delivery_close: app.validationRules._stores_hours,
    hours_thu_delivery_close: app.validationRules._stores_hours,
    hours_fri_delivery_close: app.validationRules._stores_hours,
    hours_sat_delivery_close: app.validationRules._stores_hours,
    hours_sun_delivery_close: app.validationRules._stores_hours
}

app.validationRules.getStore = {
    id_store: app.validationRules._sequence_id
}

app.validationRules.storeApplication = {
    name: { presence: true, length: { maximum: 128 }},
    email: app.validationRules._email,
    message: { length: { maximum: 256 }}
}



if (typeof module !== 'undefined' && this.module !== module) {
    exports = module.exports = app.validationRules;
}
