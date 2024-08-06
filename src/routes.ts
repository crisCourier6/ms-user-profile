import { MainController } from "./controller/MainController"

export const Routes = [
    {
        method: "get",
        route: "/profile/foodratings",
        controller: MainController,
        action: "userRatesFoodAll"
    }, 
    {
        method: "get",
        route: "/profile/:userId/foodratings/:foodLocalId",
        controller: MainController,
        action: "userRatesFoodOne"
    }, 
    {
        method: "get",
        route: "/profile/:userId/foodratings",
        controller: MainController,
        action: "userRatesFoodAllByUser"
    }, 
    {
        method: "post",
        route: "/profile/foodratings",
        controller: MainController,
        action: "userRatesFoodSave"
    }, 
    {
        method: "delete",
        route: "/profile/foodratings",
        controller: MainController,
        action: "userRatesFoodRemove"
    },
    {
        method: "delete",
        route: "/profile/:userId/foodratings",
        controller: MainController,
        action: "userRatesFoodRemoveByUser"
    },
    {
        method: "delete",
        route: "/profile/:userId/foodratings/:foodLocalId",
        controller: MainController,
        action: "userRatesFoodRemoveByFood"
    },
    {
        method: "get",
        route: "/profile/foodratings/:foodLocalId",
        controller: MainController,
        action: "userRatesFoodRatingsByFood"
    }, 
    //allergen
    {
        method: "get",
        route: "/profile/allergens",
        controller: MainController,
        action: "allergenAll"
    }, 
    {
        method: "get",
        route: "/profile/allergens/:id",
        controller: MainController,
        action: "allergenOne"
    }, 
    {
        method: "post",
        route: "/profile/allergens",
        controller: MainController,
        action: "allergenSave"
    }, 
    {
        method: "delete",
        route: "/profile/allergens/:id",
        controller: MainController,
        action: "allergenRemove"
    },
    // user rejects allergen
    {
        method: "get",
        route: "/profile/:userId/allergens",
        controller: MainController,
        action: "userRejectsAllergenAllByUser"
    }, 
    {
        method: "post",
        route: "/profile/:userId/allergens",
        controller: MainController,
        action: "userRejectsAllergenSave"
    }, 
    {
        method: "delete",
        route: "/profile/:userId/allergens",
        controller: MainController,
        action: "userRejectsAllergenRemoveAll"
    },
]