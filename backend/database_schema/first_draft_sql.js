// below is the database schema code for the first draft
// commented out to avoid error messages

// table users {
//     id integer pk
//     firstName text
//     lastName text
//     email text
//     userName text
//   }
  
//   table spots {
//     id integer pk
//     ownerId integer
//     address text
//     city  text
//     state  text
//     country  text
//     lat decimal
//     lng decimal
//     name text
//     description text
//     price decimal
//     createdAt datetime
//     updatedAt datetime
//     avgRating decimal
//     previewImage url
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
//     reviewId integer
//     url url
//   }
  
//   table bookings {
//     id integer pk
//     spotId integer
//     userId integer
//     startDate date
//     endDate date
//   }
  
//   Ref: "users"."id" - "reviews"."userId"
  
//   Ref: "users"."id" - "spots"."ownerId"
  
//   Ref: "users"."id" < "bookings"."userId"
  
//   Ref: "bookings"."spotId" > "spots"."id"
  
//   Ref: "reviews"."id" < "images"."reviewId"
  
//   Ref: "spots"."id" < "reviews"."spotId"