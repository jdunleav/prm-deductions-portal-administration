environment    = "dev"
component_name = "administration-portal"
dns_name       = "admin"

task_cpu    = 256
task_memory = 512
port        = 3000

service_desired_count = "1"

alb_deregistration_delay = 15
