const API_URL = `${process.env.REACT_APP_API_URL}/transactions`;

export const getTransactionsService = async ({
  page,
  limit,
  transactionStatus,
  search,
}) => {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page);
  if (limit) queryParams.append("limit", limit);
  if (transactionStatus) {
    const filter = { transactionStatus };
    queryParams.append("filter", JSON.stringify(filter));
  }
  if (search) {
    queryParams.append("search", search);
  }
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
