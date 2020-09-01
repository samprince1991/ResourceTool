const CustomError = require('./error');
const authFailed = new CustomError('Authorization Failed!',
    `Uh oh! i can't tell you anymore #BruteForcers! alert`, 401);
const dataInvalid = new CustomError('Data Invalid!',
    `Uh oh! the data you've sent is not as expected #Contact the developer!`, 417);
const userNotFound = new CustomError('User Not Found!',
    `Uh oh! i can't tell you anymore #BruteForcers! alert`, 404);
const userExists = new CustomError('User Exists!',
    'Uh oh! the email entered is already registered', 409);
const emailExists = new CustomError('Email Exists!',
    'Uh oh! the email entered is already registered', 409);
const duplicateRequest = new CustomError('Already Done!',
    `Umm! The stuff you are trying to do is been done already!`, 409);
const serverDown = new CustomError('umm! Some Servers are down!',
    `we swear! that it's not us, we pay our server bills on time`, 404);
const badRequest = new CustomError('Bad Request!',
    `Umm! The stuff you are trying to do is unexpected!`, 400);
//Product Errors
const productsNotFound = new CustomError('product Not Found!',
    `Umm... probaby empty data`, 404);
//Product Errors
const operationsNotFound = new CustomError('Operations Not Found!',
    `Umm... probaby no assignments found`, 404);
const couldNotCreateProduct = new CustomError('product Not created!',
    `Umm... errow while creating a product`, 400);

const couldNotDeleteProduct = new CustomError('product Not deleted!',
    `Umm... errow while deleting a product`, 400);
const couldNotDeleteProductNotFound = new CustomError('product Not deleted!',
    `Error deleting product. Product Not Found`, 400);

const couldNotDeleteProductProdutLocked = new CustomError('Product Not deleted ',
    `Error deleting product. Product is Locked`, 400);


//Operations Errors
const couldNotCreateOperations = new CustomError('Operations Not created!',
    `Umm... errow while creating a operations`);
const couldNotCreateOperationsNotAviailable = new CustomError('The product is not available ',
    `Umm... The product is not available`, 400);

const couldNotCreateOperationsNotAssignable = new CustomError('The product is not assignable ',
    `Umm... The product is not assignable`, 400);


const opsNotCreatedPrdDateNotAvailable = new CustomError('The product is not available on the selected date ',
    `The product is not available on the selected date`, 400);
//Users Errors
const eventsNotFound = new CustomError('Event Not Found!',
    `Umm... probaby no events found`, 404);
const couldNotCreateEvent = new CustomError('Event Not created!',
    `Umm... errow while creating a event`);


const usersNotFound = new CustomError('Users Not Found!',
    `Umm... probaby empty data`, 404);

const dictionarysNotFound = new CustomError('Dictionarys Not Found!',
    `Umm... probaby empty data`, 404);
const couldNotCreateDictionary = new CustomError('Dictionary Not created!',
    `Umm... errow while creating a dictionary`);

const couldNotCreateDictionaryItemExists = new CustomError('Dictionary Not created!',
    `Umm... errow while creating a dictionary. Item already exists`);

module.exports = {
    usersNotFound, opsNotCreatedPrdDateNotAvailable,
    couldNotDeleteProductNotFound,
    couldNotDeleteProductProdutLocked,
    eventsNotFound, couldNotCreateEvent, couldNotCreateDictionaryItemExists, couldNotCreateDictionary, dictionarysNotFound,
    couldNotCreateOperations, couldNotCreateOperationsNotAssignable,
    couldNotCreateOperationsNotAviailable, couldNotDeleteProduct, authFailed, dataInvalid, userNotFound, userExists, emailExists, duplicateRequest, serverDown, badRequest, productsNotFound, operationsNotFound, couldNotCreateProduct
};