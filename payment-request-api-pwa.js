async function startPayment(){  
    let checkoutDetails = {
      id: "pwa-demo-order",
      displayItems: [
        {label: "Progressier PWA Demo", amount: {currency: "USD", value: "1"}}
      ],
      total: { label: "Total", amount: {currency: "USD", value: "1"}}
    };
  
    let paymentMethods = [
      {
        supportedMethods: "basic-card",
        data: {
          supportedNetworks: ["visa", "mastercard"]
        }
      }, 
     /* {
        supportedMethods: "https://apple.com/apple-pay",
        data: { 
          version: 3, 
          merchantIdentifier: "progressier.com", 
          merchantCapabilities: ["supports3DS", "supportsCredit", "supportsDebit"], 
          supportedNetworks: ["amex", "discover", "masterCard", "visa", "maestro"],
          countryCode: "US" 
        }
      }    */          
    ];
  
    let paymentRequest = new PaymentRequest(paymentMethods, checkoutDetails);
    let response = await paymentRequest.show();
    console.log(response);
}
