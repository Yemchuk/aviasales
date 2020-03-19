const formSearch = document.querySelector(".form-search"),
  inputCitiesFrom = formSearch.querySelector(".input__cities-from"),
  dropdownCitiesFrom = formSearch.querySelector(".dropdown__cities-from"),
  inputCitiesTo = formSearch.querySelector(".input__cities-to"),
  dropdownCitiesTo = formSearch.querySelector(".dropdown__cities-to"),
  inputDateDepart = formSearch.querySelector(".input__date-depart");

const citiesApi = "data/cities.json",
  API_KEY = "5b796c16fb22c80322d9e3854aecd90e",
  calendar = "http://min-prices.aviasales.ru/calendar_preload";
// proxy = "https://cors-anywhere.herokuapp.com/";
// получить билет 25 мая Екатеренбург - Калининград

let city = [];

const getData = (url, callback) => {
  const request = new XMLHttpRequest();

  request.open("GET", url);
  request.addEventListener("readystatechange", () => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status);
    }
  });

  request.send();
};

const showCity = (input, list) => {
  list.textContent = "";

  if (input.value !== "") {
    const filterCity = city.filter(item => {
      const fixItem = item.name.toLowerCase();
      return fixItem.includes(input.value.toLowerCase());
    });
    filterCity.forEach(item => {
      const li = document.createElement("li");
      li.classList.add("dropdown__city");
      li.textContent = item.name;
      list.append(li);
    });
  }
};

const renderCheapDay = cheapTicket => {
  console.log("cheapTicket: ", cheapTicket);
};

const renderCheapYear = cheapTickets => {
  console.log(
    "cheapTickets: ",
    cheapTickets.sort((a, b) => a.value - b.value)
  );
};

const renderCheap = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;
  const cheapTicketDay = cheapTicketYear.filter(item => {
    return item.depart_date === date;
  });

  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear);
};

const handlerCity = (event, input, list) => {
  const target = event.target;
  if (target.tagName.toLowerCase() == "li") {
    input.value = target.textContent;
    list.textContent = "";
  }
};

inputCitiesFrom.addEventListener("input", () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener("input", () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener("click", event => {
  handlerCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener("click", event => {
  handlerCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener("submit", event => {
  event.preventDefault();

  const cityFrom = city.find(item => inputCitiesFrom.value === item.name);
  const cityTo = city.find(item => inputCitiesTo.value === item.name);

  const formData = {
    from: cityFrom.code,
    to: cityTo.code,
    when: inputDateDepart.value
  };

  const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}`;

  getData(calendar + requestData, data => {
    renderCheap(data, formData.when);
  });
});

getData(citiesApi, data => {
  city = JSON.parse(data).filter(item => item.name);
});

// getData(
//   proxy +
//     calendar +
//     "?depart_date=2020-05-25&origin=SVX&destination=KGD&one_way=true&token=" +
//     API_KEY,
//   data => {
//     // city = JSON.parse(data).filter(item => item.name);
//     console.log("JSON.parse(data): ", JSON.parse(data));
//   }
// );
