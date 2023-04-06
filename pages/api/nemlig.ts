import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "path";

const API_ROOT = 'https://www.nemlig.com/webapi'

export type NemligResult = {
    products: Array<NemligProduct>,
    itemsInBasket: string,
    totalPrice: string 
}

export type NemligProduct = {
    id: string,
    name: string,
    gptName: string
}

export type NemligRequest = {
    productNames: string[],
    username: string,
    password: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const productList: Array<NemligProduct> = [];
    const productPromises: Array<Promise<NemligProduct>> = []
    for (let index = 0; index < req.body.productNames.length; index++) {
        const element = req.body.productNames[index];
        const product = GetProductId(element);
        productPromises.push(product);
    }
    await Promise.all(productPromises).then(products => {
        products.forEach(product => productList.push(product))
    });

    const loginCookie = await login(req.body.username, req.body.password);
    if (loginCookie === undefined) {
        return;
    }


    const addBasketList: Array<Promise<void>> = [];
    for (let index = 0; index < productList.length; index++) {
        const element: NemligProduct = productList[index];
        if (element.id !== "") {
            addBasketList.push(addToBasket(loginCookie, element.id));
        }
    }
    await Promise.all(addBasketList);

    console.log("###########################################")
    console.log(productList);

    const basket = await getBasket(loginCookie);

    const nemLigResult: NemligResult = {
        itemsInBasket: basket.NumberOfProducts,
        totalPrice: basket.TotalProductsPrice,
        products: productList
    }

    return res.status(200).json(nemLigResult);
}

async function getBasket(cookie: string) {
    const path = "/basket/GetBasket";

    const result = await fetch(API_ROOT + path, {
        method: "GET",
        headers: {
            "Cookie": cookie
        }
    });
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%");
    console.log(result);
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%");
    return result.json();
}

async function addToBasket(cookie: string, productId: string) {
    const path = "/basket/AddToBasket";

    console.log("%%%%%%%%ADDING%%%%%%%%%%%%%%%%");
    console.log(productId);
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%");

    const result = await fetch(API_ROOT + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookie
        },
        body: JSON.stringify({
            ProductId: productId,
            quantity: 1
        })
    });
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%");
    console.log(result);
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%");
}

async function login(username: string, password: string) {
    const path = "/login";
    const result = await fetch(API_ROOT + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Username: username,
            Password: password
        })
    });
    var loginCookie = result.headers.get("set-cookie");
    if (loginCookie === null) {
        return;
    } 
    const regexCookie = getCookie(loginCookie);
    if (regexCookie === undefined) {
        return
    }

    console.log("%%%%%%%%LOGIN GOOD%%%%%%%%%%%%%%%%");
    console.log(loginCookie);
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%")

    return regexCookie;
}

function getCookie(cookies: string) {
    const regex = new RegExp('(\\.ASPXAUTH=.*SameSite=Lax,)', 'gm')
    
    let m;
    
    while ((m = regex.exec(cookies)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        // The result can be accessed through the `m`-variable.
        if (m.length > 0) {
            return m[0];
        }
    }
}

async function GetProductId(productName: string) {
    const trimName = productName.trim();
    console.log(trimName)
    try {
        const path = '/s/0/1/0/Search/Search?query=';
        const result = await (await fetch(API_ROOT + path + trimName)).json();
        const parsed: NemligProduct = {id: result.Products.Products[0].Id, name: result.Products.Products[0].Name + ", " + result.Products.Products[0].Description, gptName: productName};
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%");
        console.log(parsed);
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%");
        return parsed;
    } catch (error) {
        const parsed: NemligProduct = {id: "", name: "", gptName: productName};
        return parsed;
    }
    
}