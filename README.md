# Bookbnb
---

# Levantar expo

## Construir imagen

```
docker build . --tag bookbnb-app
```

## Levantar contenedor

```
docker run -it \
           --rm \
           -v $PWD:/app \
           -p 19006:19006 \
           -p 19001:19001 \
           -p 19000:19000 \
           bookbnb-app
```

