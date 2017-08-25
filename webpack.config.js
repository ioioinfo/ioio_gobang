/**
 ┌──────────────────────────────────────────────────────────────┐
 │               ___ ___ ___ ___ ___ _  _ ___ ___               │
 │              |_ _/ _ \_ _/ _ \_ _| \| | __/ _ \              │
 │               | | (_) | | (_) | || .` | _| (_) |             │
 │              |___\___/___\___/___|_|\_|_| \___/              │
 │                                                              │
 │                                                              │
 │                       set up in 2015.2                       │
 │                                                              │
 │   committed to the intelligent transformation of the world   │
 │                                                              │
 └──────────────────────────────────────────────────────────────┘
*/

module.exports = {
    entry: {
        index: './app/index.jsx',
        bind_local: './app/bind_local.jsx',
        bind_nonlocal: './app/bind_nonlocal.jsx',
        sales_person:  './app/sales_person.jsx',
        buy_process:   './app/buy_process.jsx',
        list:   './app/list.jsx',
        intention:   './app/intention.jsx',
        car_show:   './app/car_show.jsx',
        my_car:   './app/my_car.jsx',
        appointment:   './app/appointment.jsx',
        employees:   './app/employees.jsx',
        repair_history :   './app/repair_history.jsx',
        appointment_detail:   './app/appointment_detail.jsx',
        my_customer:   './app/my_customer.jsx',
        my_contract:   './app/my_contract.jsx',
        appointment_service:   './app/appointment_service.jsx',
        maintenance:   './app/maintenance.jsx',
        appointment_list:   './app/appointment_list.jsx',
        maintenance_detail:   './app/maintenance_detail.jsx',
        sos:   './app/sos.jsx',
        all_intention_customer :  './app/all_intention_customer.jsx',
        my_vip :  './app/my_vip.jsx',
        vip_instructions :  './app/vip_instructions.jsx',
        results :  './app/results.jsx',
    },
    output: {
        path: __dirname,
        filename: './public/js/app/[name].js'
    },
    resolve: {
        modules: [__dirname, '../node_modules','components'],
        alias: {

        },
        extensions: ['.js','.jsx']
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                },
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/
            }
        ]
   }
};
