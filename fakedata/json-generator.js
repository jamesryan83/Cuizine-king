// https://www.json-generator.com/


[
  '{{repeat(50)}}',
  {
    id_store: '{{index() + 1}}',
    id_company: 11,
    name: '{{random("Maharaja Treat Indian Restaurant","Craft Burgers, Beers & Burritos by Chidos","Chidos Mexican Grill Tingalpa","Tamarind Tree Thai Restaurant","Masala Hut Authentic Indian Restaurant","Panchos Pizza","Thai Legend Restaurant","Pawpaw Asian Kitchen","Red Galanga Asian Cuisine","Chiangrai Thai Norman Park","Turbans and Cowboys","Scherhazade Indian Restaurant","Morningside Thai Restaurant","Earth n Sea","Chop Chop","Pompidou Cafe","Shehnai Indian Restaurant","Jatt Flava","Crust Gourmet Pizza Bar","Piccolo Pizza","Rajs Palace","Blue Gulabi","My Greek Cuzina","Indian Brothers","Dosa Plaza","Mozza Pizza & Pasta","Golden Buddha Thai Restaurant","The Yiros Shop","Its Mirchi Healthy Indian","Coorparoo Fusion Delight","Red Emperor Seafood","Turbans & Cowboys","Indus Cafe Express","The Spotted Cod","Ohio Cafe","Arlington Oriental Chinese Restaurant","Rose Niyom Thai","Sunshine Sushi & Dumplings","Earth N Sea","Curry Heaven","Hello India","Sloppies Lutwyche","Pizzalunga Da Carlo","Chompers Kedron","Thai on Rode","Sammys Woodfired Pizzeria","Spice of India","Thai Naramit Authentic Thai Food","Signature Tadka","Singhs Curry Hut")}}',
    open: '{{random("Open Now", "Closed")}}',
    openTime: function (tags) {
		return this.open == "Closed" ?
          ("Opens at " + tags.random("5am", "6am", "7am", "8am", "9am")) :
          ("Closes at " + tags.random("10pm", "11pm", "12am", "1am", "2am"));
    },
    phone_number: '{{integer(3000, 3999) + " " + integer(0, 9999)}}',
    delivery_price: '{{floating(0, 15, 1, "$0,0.00")}}',
    min_order: '{{floating(10, 30, 1, "$0,0.00")}}',
    avgReview: '{{floating(1, 5, 3)}}',
    numReviews: '{{integer(1, 110)}}',
    suburb: '{{random("Bulimba", "Hawthorne", "Morningside", "East Brisbane", "Balmoral")}}',
    categories: [
    '{{repeat(1, 4)}}',    '{{random("American","Asian","AsianFusion","Australian","Bakery","BarFood","BBQ","Brazilian","Breakfastandbrunch","Burger","Cafe","Chinese","Coffeeandtea","ComfortFood","Cupcake","Deli","Desserts","Diner","Dumpling","English","European","FastFood","Fishandchips","French","German","Gluten-free","Gluten-freefriendly","Greek","Halal","Healthy","Icecreamandfrozenyoghurt","Indian","Indonesian","Italian","Jamaican","Japanese","Juiceandsmoothies","Korean","LatinAmerican","LatinFusion","Lebanese","Malaysian","Mediterranean","Mexican","MiddleEastern","ModernAustralian","ModernEuropean","Moroccan","Nepalese","NorthIndian","Pakistani","Pastry","Pizza","Pub","Salad","Sandwich","Seafood","Singaporean","SoulFood","SouthIndian","Spanish","StreetFood","Sushi","Thai","Turkish","Vegan","Veganfriendly","Vegan-Friendly","Vegetarian","Vegetarianfriendly","Vietnamese","WestIndian","Western","Wings")}}'],
    image: '{{ "/res/images/foodpics/" + integer(1, 23) + ".jpg" }}'
  }
]