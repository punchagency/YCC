import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/suppliers`;

async function getAllSuppliers() {
    let allSuppliers = [];
    let page = 1;
    let hasNextPage = true;
  
    while (hasNextPage) {
      const response = await axios.get(API_URL, {
        params: {
          page,
          pageSize: 10
        },
      });
      const suppliers = response.data.data.result;
      allSuppliers.push(...suppliers);
  
      hasNextPage = response.data.data?.hasNextPage;
      page++;
    }
  
    return allSuppliers;
  }

export { getAllSuppliers };