export default function paystackInline(customerEmail, amount, phone, paystackCallback,that) {
    var handler = PaystackPop.setup({
        key: 'pk_test_3c53bcffeb3c889d04ea0f905c44d36fc342aa85',
        email: customerEmail,
        amount: amount,
        // ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        metadata: {
            custom_fields: [
                {
                    display_name: "Mobile Number",
                    variable_name: "mobile_number",
                    value: phone
                }
            ]
        },
        callback: paystackCallback.bind(that),
        // callback: function (response) {
        //     alert('success. transaction ref is ' + response.reference);
        //     return response;
        // },
        onClose: function () {
            alert('window closed');
        }
    });
    handler.openIframe();
}