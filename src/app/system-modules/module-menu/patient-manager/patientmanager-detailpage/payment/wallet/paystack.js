export default function crop () {
    PaystackPop.setup({
        key: 'pk_test_3c53bcffeb3c889d04ea0f905c44d36fc342aa85',
        email: 'sunday.orimoyegun@apmis.ng',
        amount: 100000,
        container: 'paystackEmbedContainer',
        callback: function (response) {
            alert('successfully subscribed. transaction ref is ' + response.reference);
            // verify endpoint
            // store this authorization token
        },
    });
  }