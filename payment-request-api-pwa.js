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
      }, 
    /*  {
        supportedMethods: 'https://google.com/pay', 
        data: {
              environment: 'TEST',
              apiVersion: 2,
              apiVersionMinor: 0,
              merchantInfo: {
                // A merchant ID is available after approval by Google.
                // @see {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist}
                // merchantId: '12345678901234567890',
                merchantName: 'Example Merchant'
              },
              allowedPaymentMethods: [{
                type: 'CARD',
                parameters: {
                  allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                  allowedCardNetworks: ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"]
                },
                tokenizationSpecification: {
                  type: 'PAYMENT_GATEWAY',
                  // Check with your payment gateway on the parameters to pass.
                  // @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway}
                  parameters: {
                    'gateway': 'example',
                    'gatewayMerchantId': 'exampleGatewayMerchantId'
                  }
                }
              }]
            }
      },
     {
        supportedMethods: "https://apple.com/apple-pay",
        data: { 
          version: 3, 
          merchantIdentifier: "progressier.com", 
          merchantCapabilities: ["supports3DS", "supportsCredit", "supportsDebit"], 
          supportedNetworks: ["amex", "discover", "masterCard", "visa", "maestro"],
          countryCode: "US" 
        }
      }   */     
    ];
  
    let paymentRequest = new PaymentRequest(paymentMethods, checkoutDetails);
    let response = await paymentRequest.show();
    console.log(response);
}
