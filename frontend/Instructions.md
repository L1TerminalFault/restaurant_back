# Awaze Backend Integration Stages

## Stage 1 (Main Priority / ASAP)
- Restaurant Owner Authentication (To Basic Admin Page)
- Creating Food / Categories (Including Food Information)
- Menu Page FUll Setup
  - Fetch Food Information to menu page
  - Search Foods from Restaurant Database

## Stage 2 (Second Priority)
- Super Admin Authentication
- Super Admin Dashboard
- Restaurant Owner Dashboard

## Stage 3 (Last but definitely not least)
- Food Comment System (Rating within it)

# Notes to take 
- No frontend redesign needed. (Other than changing the already designed one to Nuxt version.)
- Need to change the basicadmin.html and bikidash.html (Super Admin Dashboard) to a Nuxt version Pages.
- Make Super Admin Access and Manage the restaurants database within it's dashboard without needing their passwords. (In the Restaurants Section only)
- Only the Super Admin can access, download the QR codes for the restaurants, Create / Delete a Restaurant.
- Restaurant Owner Dashbaord Information Depends on the subscription plan (Free / Premium).
  - Free - Only have access to creating food, categories, manage them, manage restaurant informations, ...
  - Premium - All Free features + the basicadmin.html dashboard features.



## Information to add to Restaurant owner dashboard (Premium only)
- Total QR scans
- Daily / Weekly visitors
- Peak visiting hours
- Average menu viewing time
- Most Viewed Foods / Least Viewed Foods and Why?
- Most viewed categories (with percentages form the whole view counts
- Average time spent on each dish)
- Foods customers compare (when people are seeing two dishes back to back)
- View changes after an arrangement in image / Details
- Monthly Report: Visits:↑18%, Most Popular Dish, Best Day, Worst Day, Top Category, Hidden Opportunity.
