
```html
<n-content-template graphql 
  src='https://content.io/graphql'
  filter="$sum(data.cart.items.(cost*count))"
  >
  <n-query data-value="{{user:id}}">
    query cart(id: $value) {
      items {
        count
        cost
      }
    }
  </n-query>
  <template>
    {{data:item}}
  </template>
  
  </n-content-template>
```

### GraphQL Response
```json
{
  "data": {
    "cart": [
      {
        "items": [
          {
            "count": 3,
            "cost": 5
          },
          {
            "count": 3,
            "cost": 8
          }
        ],
        "effective": "2022-06-01"
      }
    ]
  }
}
```

### JSON Filter transforms the response data to this:

The expression can be any string or an expression with tokens from a registered provider.


