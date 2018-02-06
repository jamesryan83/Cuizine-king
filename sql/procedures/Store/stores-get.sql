-- Get a store
CREATE OR ALTER PROCEDURE stores_get
    @id_store INT AS

    SELECT id_store, name, description, phone_number, email, logo,

        -- addresses
        (SELECT a.id_address, a.line1, a.line2, a.latitude AS address_latitude, a.longitude AS address_longitude,
        pc.id_postcode, pc.postcode, pc.suburb, pc.state, pc.latitude AS postcode_latitude, pc.longitude AS postcode_longitude
        FROM App.addresses a
        JOIN App.postcodes pc ON pc.id_postcode = a.id_postcode
        WHERE a.id_address = s.id_address FOR JSON PATH) AS 'address',

        -- hours
        (SELECT bh.id_business_hour, bh.day, bh.dine_in_hours, bh.opens, bh.closes
        FROM Store.business_hours bh
        WHERE bh.id_store = @id_store FOR JSON PATH) AS 'hours',

        -- reviews
        (SELECT COUNT(*)
        FROM Store.reviews r
        WHERE r.id_store = @id_store) AS 'review_count',

        -- products and product options
        (SELECT pr.id_product, pr.name, pr.description, pr.store_notes, pr.delivery_available,
         pr.gluten_free, pr.vegetarian, pr.in_stock, pr.position_id_previous, pr.position_id_next,
             (SELECT po.id_product_option, po.id_product, po.name, po.store_notes, po.price, po.limit_per_customer,
              po.in_stock, po.position_id_previous, po.position_id_next
              FROM Product.product_options po
              WHERE po.id_product = pr.id_product FOR JSON PATH) AS 'options'
         FROM Product.products pr
         WHERE pr.id_store = @id_store AND pr.active = 1 FOR JSON PATH) AS 'products',

        -- product extras
        (SELECT pe.id_product_extra, pe.name, pe.price, pe.store_notes, pe.limit_per_product,
         pe.in_stock, pe.position_id_previous, pe.position_id_next
         FROM Product.product_extras pe
         WHERE pe.id_store = @id_store AND pe.active = 1 FOR JSON PATH) AS 'product_extras'

    FROM Store.stores AS s
    WHERE s.id_store = @id_store AND is_deleted = 0
    FOR JSON PATH

GO