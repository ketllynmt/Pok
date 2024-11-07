import { urlPokeApi } from "../constants/constants.js"
import showError from "../errors/errors.js";

export async function listAllPokemons(urlApi = urlPokeApi){
    try{
        const data = await fetch(urlApi);
        const response = await data.json();
        
        return response;

    }catch(error){
        showError("Ops! Um erro inexperado ocorreu ao carregar a lista de pokémons!");
        console.error(error.message);
    }
}