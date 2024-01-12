# ⚒ Getting Started

If you're a dapp and you want to publish attestations, here are the steps to get up and running:

1. Decide on your [_**schema**_](core-concepts/schemas.md), which is a description of what your attestations will look like.
2. Deploy your [_**portal**_](core-concepts/portals.md), which is a contract through which you push attestations into the registry\
   (note: you can also just call a smart contract function to do this for you - simple!).
3. Send your [_**attestations**_](core-concepts/attestations.md) to your portal contract, which will push them to the registry.
4. All done! :coffee:

***

You can just call a function on the registry to deploy a portal contract for you, or you can deploy your own portal contract, over which you have full control to customize however you wish.

You can decide to keep your portal simple, and you can also use one or more [_**modules**_](core-concepts/modules.md), which are small smart contracts that run extra verification logic over the attestations before they are registered.  There are some [examples modules in our GitHub repo](https://github.com/Consensys/linea-attestation-registry/tree/dev/contracts/src) that you can use, and more are being added all the time.

{% hint style="success" %}
Please feel free to contact the developers in the community for support!  They are always eager to help teams to get up and running quickly! You can find advice on our [**Discord server**](https://discord.gg/Sq4EmYdBEk).
{% endhint %}

_**Note:**_ the Verax registry is currently permissioned, so you'll need to get on the allowlist in order to register schemas or portals.  Fortunately this is very easy, just reach out on Discord! :smile:
