// below is the database schema code for the first draft
// commented out to avoid error messages

// table users {
//     id integer pk
//     firstName varchar
//     lastName varchar
//     email varchar
//     userName varchar
//   }
  
//   table spots {
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
  
//   table reviews {
//     id integer pk
//     userId integer
//     spotId integer
//     review text
//     stars decimal
//     createdAt datetime
//     updatedAt datetime
//   }
  
//   table images {
//     id integer pk
//     imageableId integer
//     imageType varchar
//     url varchar
//   }
  
//   table bookings {
//     id integer pk
//     spotId integer
//     userId integer
//     startDate date
//     endDate date
//     createdAt datetime
//     updatedAt datetime
//   }
  
//   Ref: "users"."id" - "reviews"."userId"
  
//   Ref: "users"."id" - "spots"."ownerId"
  
//   Ref: "users"."id" < "bookings"."userId"
  
//   Ref: "bookings"."spotId" > "spots"."id"
  
//   Ref: "spots"."id" < "reviews"."spotId"
  
//   Ref: "images"."imageableId" > "spots"."id"
  
//   Ref: "images"."imageableId" > "reviews"."id"