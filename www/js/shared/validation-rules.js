"use strict";

// Validation
// https://validatejs.org/

// these are related to the tables in server/sql
// and are used server and client side

var app = app || {};

app.validationRules = {};
var vr = app.validationRules;



// General shared validation rules

// for sequence id's such as id_store, id_adress, updated_by etc.
vr._sequence_id = { presence: true, numericality: { onlyInteger: true, greaterThan: 0 }};
vr._sequence_id_optional = { numericality: { onlyInteger: true, greaterThan: 0 }};

vr._email =                 { presence: true, email: true, length: { minimum: 3, maximum: 256 }};
vr._email_optional =        { email: true, length: { minimum: 3, maximum: 256 }};
vr._phone_number =          { presence: true, length: { minimum: 3, maximum: 32 }};
vr._phone_number_optional = { length: { minimum: 3, maximum: 32 }};
vr._url_link =              { presence: true, length: { maximum: 256 }};
vr._url_link_optional =     { length: { maximum: 256 }};
vr._bit =                   { presence: true, numericality: { onlyInteger: true, greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1 }};
vr._bit_optional =          { numericality: { onlyInteger: true, greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1 }};
vr._notes_optional =        { length: { maximum: 256 }};
vr._price =                 { presence: true, numericality: { greaterThanOrEqualTo: 0 }};
vr._price_optional =        { numericality: { greaterThanOrEqualTo: 0 }};
vr._quantity =              { presence: true, numericality: { onlyInteger: true, greaterThan: 0 }};
vr._latitude_optional =     { numericality: { greaterThanOrEqualTo: 0 }};
vr._longitude_optional =    { numericality: { greaterThanOrEqualTo: 0 }};


// these groups of validation things match the values in the sql tables
// values not here are using the generic values above

vr._addresses_line1 =                  { presence: true, length: { maximum: 128 }};
vr._addresses_line2_optional =         { length: { maximum: 128 }};

vr._people_first_name =                    { presence: true, length: { minimum: 2, maximum: 45 }};
vr._people_first_name_optional =           { length: { minimum: 2, maximum: 45 }};
vr._people_last_name =                     { presence: true, length: { minimum: 2, maximum: 45 }};
vr._people_last_name_optional =            { length: { minimum: 2, maximum: 45 }};
vr._people_password =                      { presence: true, length: { minimum: 3, maximum: 64 }};
vr._people_reset_password_token =          { presence: true, length: 64 };
vr._people_reset_password_token_optional = { presence: true, length: 64 };
vr._people_jwt_optional =                  { length: { minimum: 30, maximum: 512 }};
vr._people_verification_token =            { presence: true, length: 64 };

vr._postcodes_postcode = { presence: true, length: { minimum: 1, maximum: 6 }};
vr._postcodes_suburb =   { presence: true, length: { minimum: 1, maximum: 64 }};
vr._postcodes_state =    { presence: true, length: { minimum: 1, maximum: 32 }};

vr._business_hours_day =    { presence: true, numericality: { onlyInteger: true, greaterThan: 0, lessThan: 8 }};
vr._business_hours_opens =  { presence: true, length: { maximum: 8 }};
vr._business_hours_closes = { presence: true, length: { maximum: 8 }};

vr._reviews_title =           { presence: true, length: { minimum: 2, maximum: 128 }};
vr._reviews_review_optional = { length: { maximum: 512 }};
vr._reviews_rating =          { presence: true, numericality: { onlyInteger: true, greaterThan: 0, lessThan: 6 }};

vr._stores_logo =                 { presence: true, length: { maximum: 256 }};
vr._stores_name =                 { presence: true, length: { maximum: 512 }};
vr._stores_description_optional = { length: { maximum: 1024 }};
vr._stores_abn =                  { presence: true, length: { maximum: 32 }};

vr._product_extras_name = { presence: true, length: { maximum: 128 }};

vr._product_options_name = { presence: true, length: { maximum: 128 }};

vr._products_name =                 { presence: true, length: { maximum: 128 }};
vr._products_description_optional = { length: { maximum: 256 }};

vr._order_products_customer_notes_optional = { length: { maximum: 256 }};

vr._orders_notes_optional = { length: { maximum: 256 }};
vr._orders_expiry =         { presence: true, datetime: true }; // TODO: does this work ?

vr._transactions_commission =     { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } }; // TODO : is 1000 ok ?
vr._transactions_processing_fee = { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } };









// These validation objects below use the values from above

// -------- Auth route validation --------


vr.login = {
    email: vr._email,
    password: vr._people_password
}


vr.peopleCreate = {
    first_name: vr._people_first_name,
    last_name: vr._people_last_name,
    email: vr._email,
    password: vr._people_password,
    confirmPassword: { equality: "password" }
}

vr.sendRegistrationEmail = { email: vr._email }


vr.verifyAccount = {
    email: vr._email,
    password: vr._people_password,
    token: vr._people_verification_token
}


vr.forgotPassword = { email: vr._email }


vr.resetPassword = {
    password: vr._people_password,
    confirmPassword: { equality: "password" },
    token: vr._people_reset_password_token
}




// -------- Store route validation --------

vr.createStore = {
    postcode: vr._postcodes_postcode,
    suburb: vr._postcodes_suburb,
    unit_number: vr._addresses_unit_number_optional,
    street_number: vr._addresses_street_number,
    street: vr._addresses_street,
    first_name: vr._people_first_name,
    last_name: vr._people_last_name,
    email_user: vr._email,
    phone_number_user: vr._phone_number,
    password: vr._people_password,
    jwt: vr._people_jwt_optional, // TODO : Might not need to check this here
    internal_notes_user: vr._notes_optional,
    logo:vr._stores_logo,
    name: vr._stores_name,
    description: vr._stores_description_optional,
    email_store: vr._email,
    phone_number_store: vr._phone_number,
    website: vr._url_link_optional,
    facebook: vr._url_link_optional,
    twitter: vr._url_link_optional,
    abn: vr._stores_abn,
    internal_notes_store: vr._notes_optional
}





// -------- API validation --------


// Me
vr.apiMeGet = { email: vr._email }

vr.apiMeUpdate = {
    id_user: vr._sequence_id_optional,
    email: vr._email_optional,
    token: vr._people_reset_password_token_optional,
    first_name: vr._people_first_name_optional,
    last_name: vr._people_last_name_optional
}

vr.apiMeDelete = { email: vr._email }



if (typeof module !== 'undefined' && this.module !== module) {
    exports = module.exports = app.validationRules
}
