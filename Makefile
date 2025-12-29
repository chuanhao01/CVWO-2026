# Help Commands
.PHONY: default
default: help

# -- Supabase
# To setup the first time and link
# supabase init
# supabase link --project-ref <project-id>

# Starts local supabase
.PHONY: supabase-start
supabase-start:
	supabase start

# Stops local supabase
.PHONY: supabase-stop
supabase-stop:
	supabase stop

# Pull new db schema changes down locally
.PHONY: supabase-pull
supabase-pull:
	supabase db pull
	supabase migration up

# Resets local db
.PHONY: supabase-reset
supabase-reset:
	supabase db reset

.PHONY: help
help:
	@echo 'Usage: make [command]'
