

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION
	INSERT INTO Store.reviews(id_store,id_person,title,review,rating,updated_by) VALUES (1,1,'My favourite','I stumbled on this undiscovered gem right in our neighboorhood. I want to hire their decorator to furnish my apartment. The waitress was prompt and polite. Everything I tried was bursting with flavor. Make sure to save room for dessert, because that was the best part of the meal!',4.2,3)
	INSERT INTO Store.reviews(id_store,id_person,title,review,rating,updated_by) VALUES (1,2,'Very nice','Decent place. Make sure to save room for dessert, because that was the best part of the meal! Try out the huge selection of incredible appetizers. After my meal, I was knocked into a food coma. The chicken was a little dry',3.8,3)
	INSERT INTO Store.reviews(id_store,id_person,title,review,rating,updated_by) VALUES (1,3,'Awesome !','I''ve got a fetish for good food and this place gets me hot! Try out the huge selection of incredible appetizers. The waitress was prompt and polite. The food was flavorful, savory, and succulent. After my meal, I was knocked into a food coma',4.4,3)
COMMIT

GO


