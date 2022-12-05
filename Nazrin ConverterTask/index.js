const form = document.querySelector('form');
const selectForCurrency = document.querySelector('#selectForCurrency');
const mainCurrenciesList = document.querySelector('.mainCurrenciesList');
const inputsForAmount = document.querySelectorAll('input');

let selectedCurrencies = [{currency: 'AZN', amount: 0}, {currency: 'RUB', amount: 0}, {currency: 'EUR', amount: 0}, {currency: 'USD', amount: 0}];
let currencies = [];
// let mainCurrency = 'AZN';
let mainCurrency = selectedCurrencies[0].currency;
let mainAmount = 1;

const baseUrl = 'https://api.exchangerate.host/';
const symbolsUrl = new URL('/symbols', baseUrl);
const converterUrl = new URL('/convert', baseUrl);

fetch(symbolsUrl).then(res => res.json())
.then(data => {
    Object.keys(data.symbols).map((v) => {
        selectForCurrency.options[selectForCurrency.options.length] = new Option(v, v);
    });
});

const getCurrency = async (v, amount = 1) => {
    const currency = {date: null, result: 0};
    converterUrl.searchParams.set('from', mainCurrency);
    converterUrl.searchParams.set('to', v);
    converterUrl.searchParams.set('amount', amount);
    await fetch(converterUrl).then(res => res.json()).then(data => {
        currency.date = data.date;
        currency.result = data.result;
    });
    
    const mainCurrenciesItem = document.createElement('div');
    mainCurrenciesItem.classList.add('main-currencies-item');
    mainCurrenciesItem.id = v + '_currency';
    mainCurrenciesItem.innerHTML= `<div class="div-header">${v}</div>
    <input type="number" name="${v}" id="${v}_currency_input"/> <div class="div-footer">
    <input type="text" id="${v}_date_label" disabled value=${currency.date} />
    <input type="text" id="${v}_currency_label" disabled value= "1 ${mainCurrency} = ${currency.result} ${v}" />
    </div>`;
    mainCurrenciesList.append(mainCurrenciesItem);
};
const addedCurrency = async (v) => {
    const currency = {date: null, result: 0};
    converterUrl.searchParams.set('from', mainCurrency);
    converterUrl.searchParams.set('to', v.currency);
    converterUrl.searchParams.set('amount', 1);
        await fetch(converterUrl).then(res => res.json()).then(data => {
            currency.date = data.date;
            currency.result = data.result;
        });
        document.querySelector(`#${v.currency}_currency_label`).value = `1 ${mainCurrency} = ${currency.result} ${v.currency}`;
    
    if(v.currency != mainCurrency) {
        converterUrl.searchParams.set('from', mainCurrency);
        converterUrl.searchParams.set('to', v.currency);
        converterUrl.searchParams.set('amount', mainAmount);
        await fetch(converterUrl).then(res => res.json()).then(data => {
            currency.date = data.date;
            currency.result = data.result;
        });
    
        document.querySelector(`#${v.currency}_currency_input`).value = currency.result;
    }
}

     selectedCurrencies.map(async v => {
        getCurrency(v.currency);
        await addedCurrency(v);
        document.querySelector('#AZN_currency_input').defaultValue = 1;
    });

selectForCurrency.addEventListener('input', (e)=> {
    if(e.target.value != "0") {
        const newCurrency = e.target.value;
        const currencies = [];
        selectedCurrencies.map(v => currencies.push(v.currency));
        if(currencies.includes(newCurrency)) {
            selectedCurrencies = selectedCurrencies.filter(v => v != newCurrency);
            document.querySelector(`#${newCurrency}_currency`).remove();
        }
        else {
            selectedCurrencies.push({currency: newCurrency, amount: 0});
            getCurrency(newCurrency);
            addedCurrency({currency: newCurrency, amount: 0}, mainAmount);
        }
        selectForCurrency.value = "0";
    }
});

form.addEventListener('input', async (e)=> {
    mainCurrency = e.target.name;
    mainAmount = e.target.value;
    selectedCurrencies.map(async v => {
        await addedCurrency(v);
    });
});