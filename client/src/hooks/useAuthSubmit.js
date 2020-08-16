import React, { useState } from "react";

export function useAuthSubmit(url, values, replUrl) {
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    console.log("values", values);

    fetch(url, {
      method: "post",
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => {
        //console.log("response", response);
        return response.json();
      })
      .then((data ) => {
          console.log("data", data);
        if (!data.success) {
          setError(true);
        } else {
          window.location.replace(replUrl);
        }
      })
      .catch(err => {
        console.log(err);
        setError(true);
      });
  };

  return [error, handleSubmit];
}