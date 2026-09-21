FROM quay.io/keycloak/keycloak:26.1

# Bake the pre-configured chess realm export into the container
COPY realm-export.json /opt/keycloak/data/import/realm-export.json

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start-dev", "--import-realm"]

