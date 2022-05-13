const Listing_Information = require('../model/Listing_Information');
const wrapper = require('../utils/wrapper');

const engineListingInformation = {};

async function addListingInformation(listingId, description, monthlyRent, housingType) {
    const listingInformationNew = Listing_Information.create(
        {
            listing_id: listingId,
            description,
            monthly_rent: monthlyRent,
            housing_type: housingType,
        },
    );
    return listingInformationNew.then((results) => results.get({ plain: true }));
}
engineListingInformation.addListingInformation = addListingInformation;

// engineListingInformation.addListingInformation = wrapper.wrapperForNoTryCatchAsyncFunction(addListingInformation);

async function updateListingInformation(listingId, description, monthlyRent, housingType) {
    const listingInformationNew = Listing_Information.update(
        {
            description,
            monthly_rent: monthlyRent,
            housing_type: housingType,
        },
        {
            // raw does not work here
            where: {
                listing_id: listingId,
            },
            // attributes do not work here
        },
    );
    return listingInformationNew;
}
engineListingInformation.updateListingInformation = updateListingInformation;

async function updateListingInformationImplicit(listingId, newKeyValuePairs) {
    const listingInformationNew = Listing_Information.update(
        newKeyValuePairs,
        {
            // raw does not work here
            where: {
                listing_id: listingId,
            },
            // attributes do not work here
        },
    );
    return listingInformationNew;
}
engineListingInformation.updateListingInformationImplicit = updateListingInformationImplicit;

module.exports = engineListingInformation;
