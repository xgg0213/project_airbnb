// table Users {
//     id integer pk
//     firstName varchar
//     lastName varchar
//     email varchar
//     userName varchar
//     hashedPassword varchar
//     createdAt datetime
//     updatedAt datetime
//   }
  
//   table Spots {
//     id integer pk
//     ownerId integer
//     address varchar
//     city  varchar
//     state  varchar
//     country  varchar
//     lat decimal
//     lng decimal
//     name varchar
//     description text
//     price decimal
//     createdAt datetime
//     updatedAt datetime
//     previewImage varchar
//   }
  
//   table Reviews {
//     id integer pk
//     userId integer
//     spotId integer
//     review text
//     stars decimal
//     createdAt datetime
//     updatedAt datetime
//   }
  
//   table Bookings {
//     id integer pk
//     spotId integer
//     userId integer
//     startDate date
//     endDate date
//     createdAt datetime
//     updatedAt datetime
//   }
  
//   table SpotImages {
//     id integer pk
//     spotId integer
//     url varchar
//     createdAt datetime
//     updatedAt datetime
//   }
  
//   table ReviewImages {
//     id integer pk
//     reviewId integer
//     url varchar
//     createdAt datetime
//     updatedAt datetime
//   }
  
//   Ref: "Users"."id" < "Reviews"."userId"
  
//   Ref: "Users"."id" - "Spots"."ownerId"
  
//   Ref: "Users"."id" < "Bookings"."userId"
  
//   Ref: "Bookings"."spotId" > "Spots"."id"
  
//   Ref: "Spots"."id" < "Reviews"."spotId"
  
//   Ref: "ReviewImages"."reviewId" < "Reviews"."id"
  
//   Ref: "SpotImages"."spotId" > "Spots"."id"