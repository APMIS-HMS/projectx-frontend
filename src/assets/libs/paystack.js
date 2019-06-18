var paystack = (function () {

    return {
        func1: function () {
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
        },
        func2: function () {
            alert('function 2 called');
        }
    }

})(paystack || {})


var callPayStack = (function () {
    return {
        init: function () {
            alert('webGlObject initialized');
        }
    }
})(callPayStack || {})
