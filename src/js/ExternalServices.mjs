const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const data = await res.json(); // parse first
  if (!res.ok) {
    throw new Error(`Bad Response: ${data.message || res.statusText}`);
  }
  return data;
}

export default class ExternalServices {
  constructor() {

  }
  async getData(category) {
    // If no server URL is configured, load from local JSON files
    if (!baseURL) {
      const response = await fetch(`/json/${category}.json`);
      const data = await convertToJson(response);
      // Transform local JSON structure to match API structure
      return data.map(product => ({
        ...product,
        Images: {
          PrimaryMedium: product.Image,
          PrimaryLarge: product.Image.replace('320.jpg', '600.jpg') // Assume larger image exists
        },
        FinalPrice: product.FinalPrice || product.ListPrice
      }));
    }

    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);

    return data.Result;
  }
  async findProductById(id) {
    // If no server URL is configured, load from local JSON files
    if (!baseURL) {
      // For individual products, we need to search through all categories
      const categories = ['tents', 'backpacks', 'sleeping-bags'];
      for (const category of categories) {
        try {
          const response = await fetch(`/json/${category}.json`);
          const data = await convertToJson(response);
          const product = data.find(p => p.Id === id.toUpperCase());
          if (product) {
            // Transform local JSON structure to match API structure
            return {
              ...product,
              Images: {
                PrimaryMedium: product.Image,
                PrimaryLarge: product.Image.replace('320.jpg', '600.jpg')
              },
              FinalPrice: product.FinalPrice || product.ListPrice
            };
          }
        } catch (error) {
          console.warn(`Could not load ${category}.json:`, error);
        }
      }
      throw new Error(`Product with ID ${id} not found`);
    }

    const response = await fetch(`${baseURL}product/${id.toUpperCase()}`);
    const data = await convertToJson(response);
    console.log(data.Result);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
}