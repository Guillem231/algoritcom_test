PROJECT_NAME = "ALGORITCOM TEST GUILLEM PEDRET"

INSTALL_CMD = $(shell command -v yarn >/dev/null 2>&1 && echo "yarn install" || echo "npm install")
START_CMD = $(shell command -v yarn >/dev/null 2>&1 && echo "yarn dev" || echo "npm run dev")

define WELCOME_ART


 █████╗ ██╗      ██████╗  ██████╗ ██████╗ ██╗████████╗ ██████╗ ██████╗ ███╗   ███╗
██╔══██╗██║     ██╔════╝ ██╔═══██╗██╔══██╗██║╚══██╔══╝██╔════╝██╔═══██╗████╗ ████║
███████║██║     ██║  ███╗██║   ██║██████╔╝██║   ██║   ██║     ██║   ██║██╔████╔██║
██╔══██║██║     ██║   ██║██║   ██║██╔══██╗██║   ██║   ██║     ██║   ██║██║╚██╔╝██║
██║  ██║███████╗╚██████╔╝╚██████╔╝██║  ██║██║   ██║   ╚██████╗╚██████╔╝██║ ╚═╝ ██║
╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝     ╚═╝
                                                                                  


                      Bienvenido a $(PROJECT_NAME) 
           		 Hackeando la matriz y preparando tu setup...
             Instalando dependencias y lanzando el proyecto...
endef
export WELCOME_ART

welcome:
	@clear
	@echo "$$WELCOME_ART"
	@echo ""
	@echo " Verificando gestor de paquetes..."
	@echo " Usando: $(INSTALL_CMD)"
	@$(INSTALL_CMD)

	@echo ""
	@echo " Listo, la nave está encendida. Despegamos en 3... 2... 1..."
	@$(START_CMD)

start:
	@clear
	@echo "$$WELCOME_ART"
	@echo ""
	@echo " Encendiendo motores en $(PROJECT_NAME)..."
	@$(START_CMD)
