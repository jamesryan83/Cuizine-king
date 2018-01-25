// Validation
// https://validatejs.org/

// these are related to the tables in server/sql
// and are used server and client side

// General shared validation rules

if (typeof app === "undefined") {
    var app = {};
}

app.vr = {};

// for sequence id's such as id_store, id_adress, updated_by etc.
app.vr._sequence_id = { presence: true, numericality: { onlyInteger: true, greaterThan: 0 }};
app.vr._sequence_id_optional = { numericality: { onlyInteger: true, greaterThan: 0 }};

app.vr._email =                 { presence: true, email: true, length: { minimum: 3, maximum: 256 }};
app.vr._email_optional =        { email: true, length: { minimum: 3, maximum: 256 }};
app.vr._phone_number =          { presence: true, length: { minimum: 3, maximum: 32 }};
app.vr._phone_number_optional = { length: { minimum: 3, maximum: 32 }};
app.vr._url_link =              { presence: true, length: { maximum: 256 }};
app.vr._url_link_optional =     { length: { maximum: 256 }};
app.vr._bit =                   { presence: true, numericality: { onlyInteger: true, greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1 }};
app.vr._bit_optional =          { numericality: { onlyInteger: true, greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1 }};
app.vr._notes_optional =        { length: { maximum: 256 }};
app.vr._price =                 { presence: true, numericality: { greaterThanOrEqualTo: 0 }};
app.vr._price_optional =        { numericality: { greaterThanOrEqualTo: 0 }};
app.vr._quantity =              { presence: true, numericality: { onlyInteger: true, greaterThan: 0 }};
app.vr._latitude_optional =     { numericality: { greaterThanOrEqualTo: 0 }};
app.vr._longitude_optional =    { numericality: { greaterThanOrEqualTo: 0 }};


// these groups of validation things match the values in the sql tables
// values not here are using the generic values above

app.vr._addresses_line1 =          { presence: true, length: { maximum: 128 }};
app.vr._addresses_line2_optional = { length: { maximum: 128 }};

app.vr._people_first_name =                    { presence: true, length: { minimum: 2, maximum: 45 }};
app.vr._people_first_name_optional =           { length: { minimum: 2, maximum: 45 }};
app.vr._people_last_name =                     { presence: true, length: { minimum: 2, maximum: 45 }};
app.vr._people_last_name_optional =            { length: { minimum: 2, maximum: 45 }};
app.vr._people_password =                      { presence: true, length: { minimum: 3, maximum: 64 }};
app.vr._people_reset_password_token =          { presence: true, length: 64 };
app.vr._people_reset_password_token_optional = { presence: true, length: 64 };
app.vr._people_jwt =                           { presence: true, length: { minimum: 30, maximum: 512 }};
app.vr._people_jwt_optional =                  { length: { minimum: 30, maximum: 512 }};
app.vr._people_verification_token =            { presence: true, length: 64 };

app.vr._postcodes_postcode = { presence: true, length: { minimum: 1, maximum: 6 }};
app.vr._postcodes_suburb =   { presence: true, length: { minimum: 1, maximum: 64 }};
app.vr._postcodes_state =    { presence: true, length: { minimum: 1, maximum: 32 }};

app.vr._business_hours_day =    { presence: true, numericality: { onlyInteger: true, greaterThan: 0, lessThan: 8 }};
app.vr._business_hours_opens =  { presence: true, length: { maximum: 8 }};
app.vr._business_hours_closes = { presence: true, length: { maximum: 8 }};

app.vr._reviews_title =           { presence: true, length: { minimum: 2, maximum: 128 }};
app.vr._reviews_review_optional = { length: { maximum: 512 }};
app.vr._reviews_rating =          { presence: true, numericality: { onlyInteger: true, greaterThan: 0, lessThan: 6 }};

app.vr._stores_logo =                 { presence: true, length: { maximum: 256 }};
app.vr._stores_name =                 { presence: true, length: { maximum: 512 }};
app.vr._stores_description_optional = { length: { maximum: 1024 }};
app.vr._stores_abn =                  { presence: true, length: { minimum: 10, maximum: 32 }};
app.vr._stores_bank_name =            { presence: true, length: { minimum: 2, maximum: 128 }};
app.vr._stores_bank_bsb =             { presence: true, length: { minimum: 6, maximum: 16 }};
app.vr._stores_bank_account_name =    { presence: true, length: { minimum: 2, maximum: 128 }};
app.vr._stores_bank_account_number =  { presence: true, length: { minimum: 2, maximum: 32 }};
app.vr._stores_hours =                { presence: true, length: { minimum: 4, maximum: 5 }};

app.vr._product_extras_name = { presence: true, length: { maximum: 128 }};

app.vr._product_options_name = { presence: true, length: { maximum: 128 }};

app.vr._products_name =                 { presence: true, length: { maximum: 128 }};
app.vr._products_description_optional = { length: { maximum: 256 }};

app.vr._order_products_customer_notes_optional = { length: { maximum: 256 }};

app.vr._orders_notes_optional = { length: { maximum: 256 }};
app.vr._orders_expiry =         { presence: true, datetime: true }; // TODO: does this work ?

app.vr._transactions_commission =     { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } }; // TODO : is 1000 ok ?
app.vr._transactions_processing_fee = { presence: true, numericality: { greaterThanOrEqualTo: 0, lessThanOrEqualTo: 1000 } };









// These validation objects below use the values from above

// -------- Auth route validation --------


app.vr.login = {
    email: app.vr._email,
    password: app.vr._people_password
}

app.vr.storeLogin = {
    email: app.vr._email,
    password: app.vr._people_password
}

app.vr.createUser = {
    first_name: app.vr._people_first_name,
    last_name: app.vr._people_last_name,
    email: app.vr._email,
    password: app.vr._people_password,
    confirmPassword: { equality: "password" }
}

app.vr.verifyAccount = {
    email: app.vr._email,
    password: app.vr._people_password,
    verification_token: app.vr._people_verification_token
}

app.vr.logout = {
    jwt: app.vr._people_jwt
}

app.vr.sendRegistrationEmail = { email: app.vr._email }

app.vr.forgotPassword = { email: app.vr._email }

app.vr.resetPassword = {
    email: app.vr._people_email,
    password: app.vr._people_password,
    confirmPassword: { equality: "password" },
    reset_password_token: app.vr._people_reset_password_token
}

app.vr.checkJwt = {
    jwt: app.vr._people_jwt
}




// -------- Store route validation --------

app.vr.createStore = {
    postcode: app.vr._postcodes_postcode,
    suburb: app.vr._postcodes_suburb,

    address_line_1: app.vr._addresses_line1,
    address_line_2: app.vr._addresses_line2_optional,

    first_name: app.vr._people_first_name,
    last_name: app.vr._people_last_name,
    email_user: app.vr._email,
    phone_number_user: app.vr._phone_number,
    password: app.vr._people_password,
    internal_notes_user: app.vr._notes_optional,

    logo: app.vr._stores_logo,
    name: app.vr._stores_name,
    description: app.vr._stores_description_optional,
    email_store: app.vr._email,
    phone_number_store: app.vr._phone_number,
    website: app.vr._url_link_optional,
    facebook: app.vr._url_link_optional,
    twitter: app.vr._url_link_optional,
    abn: app.vr._stores_abn,
    internal_notes_store: app.vr._notes_optional,
    bank_name: app.vr._stores_bank_name,
    bank_bsb: app.vr._stores_bank_bsb,
    bank_account_name: app.vr._stores_bank_account_name,
    bank_account_number: app.vr._stores_bank_account_number,

    hours_mon_dinein_open: app.vr._stores_hours,
    hours_tue_dinein_open: app.vr._stores_hours,
    hours_wed_dinein_open: app.vr._stores_hours,
    hours_thu_dinein_open: app.vr._stores_hours,
    hours_fri_dinein_open: app.vr._stores_hours,
    hours_sat_dinein_open: app.vr._stores_hours,
    hours_sun_dinein_open: app.vr._stores_hours,
    hours_mon_dinein_close: app.vr._stores_hours,
    hours_tue_dinein_close: app.vr._stores_hours,
    hours_wed_dinein_close: app.vr._stores_hours,
    hours_thu_dinein_close: app.vr._stores_hours,
    hours_fri_dinein_close: app.vr._stores_hours,
    hours_sat_dinein_close: app.vr._stores_hours,
    hours_sun_dinein_close: app.vr._stores_hours,
    hours_mon_delivery_open: app.vr._stores_hours,
    hours_tue_delivery_open: app.vr._stores_hours,
    hours_wed_delivery_open: app.vr._stores_hours,
    hours_thu_delivery_open: app.vr._stores_hours,
    hours_fri_delivery_open: app.vr._stores_hours,
    hours_sat_delivery_open: app.vr._stores_hours,
    hours_sun_delivery_open: app.vr._stores_hours,
    hours_mon_delivery_close: app.vr._stores_hours,
    hours_tue_delivery_close: app.vr._stores_hours,
    hours_wed_delivery_close: app.vr._stores_hours,
    hours_thu_delivery_close: app.vr._stores_hours,
    hours_fri_delivery_close: app.vr._stores_hours,
    hours_sat_delivery_close: app.vr._stores_hours,
    hours_sun_delivery_close: app.vr._stores_hours
}

app.vr.getStore = {
    id_store: app.vr._sequence_id
}

app.vr.storeApplication = {
    name: { presence: true, length: { maximum: 128 }},
    email: app.vr._email,
    message: { length: { maximum: 256 }}
}


// alias
app.validationRules = app.vr;

if (typeof module !== 'undefined' && this.module !== module) {
    exports = module.exports = app.validationRules
}
