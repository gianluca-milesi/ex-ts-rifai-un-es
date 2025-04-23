import dayjs from "dayjs"


//Type Alias
type Recipe = {
  id: number,
  name: string,
  userId: number
}

type User = {
  id: number,
  firstName: string,
  birthDate: string
}

type ApiErrorMessage = {
  message: string
}

//Type Guards
function isRecipe(data: unknown): data is Recipe {
  return (
    typeof data === "object" && data !== null &&
    "id" in data && typeof data.id === "number" &&
    "name" in data && typeof data.name === "string" &&
    "userId" in data && typeof data.userId === "number"
  )
}

function isUser(data: unknown): data is User {
  return (
    typeof data === "object" && data !== null &&
    "id" in data && typeof data.id === "number" &&
    "firstName" in data && typeof data.firstName === "string" &&
    "birthDate" in data && typeof data.birthDate === "string"
  )
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url)
  if (!response.ok) {
    const errorData = await response.json() as ApiErrorMessage
    throw new Error(errorData.message || "Errore sconosciuto")
  }
  const data: unknown = await response.json()
  return data
}

async function getChefBirthday(id: number): Promise<string> {

  let recipe: Recipe
  try {
    const response = await fetchJson(`https://dummyjson.com/recipes/${id}`)
    if (!isRecipe(response)) {
      throw new Error("Formato non valido")
    }
    recipe = response
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err)
    } else {
      console.error("Errore sconosciuto", err)
    }
    throw new Error(`Non posso recuperare la ricetta con id: ${id}`)
  }

  let user: User
  try {
    const response = await fetchJson(`https://dummyjson.com/users/${recipe.userId}`)
    if (!isUser(response)) {
      throw new Error("Formato non valido")
    }
    user = response
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err)
    } else {
      console.error("Errore sconosciuto", err)
    }
    throw new Error(`Non posso recuperare lo chef con id: ${id}`)
  }

  const formattedBirthDate = dayjs(user.birthDate).format("DD/MM/YYYY")
  return formattedBirthDate
}


getChefBirthday(5)
  .then(birthday => console.log("Data di nascita dello chef:", birthday))
  .catch(error => console.error("Errore:", error.message));