module.exports = {
    apps: [
        {
            name: "rambd-client",
            script: "./server.js",
            instances: 1,
            exec_mode: "cluster",
            env: {
                NODE_ENV: "production",
                PORT: 3000,
                HOSTNAME: "localhost"
            },
            error_file: "./logs/pm2-error.log",
            out_file: "./logs/pm2-out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
            merge_logs: true,
            autorestart: true,
            watch: false,
            max_memory_restart: "500M",
            // Graceful reload settings
            kill_timeout: 5000,
            listen_timeout: 10000,
            shutdown_with_message: true,
            // Advanced PM2 features
            min_uptime: "10s",
            max_restarts: 10,
            restart_delay: 4000,
            // Environment-specific overrides
            env_production: {
                NODE_ENV: "production",
                PORT: 3000
            }
        }
    ]
};
