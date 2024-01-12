# Contribute to Development

Verax is an open source project, and is community maintained, which means it is depedent on contributions from the teams that use it.  Contributions are very welcome, and it is easy to open a pull request for development you wish to do.

The community would love to hear your ideas and support your efforts to contribute, so feel free to get in touch with us and tell us about how you'd like to get involved.

If you'd like to get involved but you're unsure where to get start, here are some ideas:

{% tabs %}
{% tab title="Example Modules" %}
Other developers can benefit from having a standard library of modules that they can use, or simply reference as an example.  There are a bunch of [**stories on our backlog**](https://github.com/orgs/Consensys/projects/17) for building out single, small modules, which are simple smart contracts that we add to [the "example" folder of our repo](https://github.com/Consensys/linea-attestation-registry/tree/dev/contracts/src/example). Please feel to take one of these stories, and then open a pull request!
{% endtab %}

{% tab title="Website" %}
We don't have one!  If you have design skills or UI engineering skills, this is where you can help!  We don't even need a comprehensive website with multiple pages, but a simple landing page that helps people to understand what Verax is a high level will be a huge help!
{% endtab %}

{% tab title="Documentation" %}
Writing technical docs is hard!  Documentation can always be improved on, so this is an area we certainly need help with!  Please feel free to open a PR to our documentation repo, or simply write a tutorial for others to follow.
{% endtab %}

{% tab title="General Coding" %}
We still need to build out our web explorer, so we need UI engineering skills, and we would like to build an open source indexer to allow compute-heavy reputation protocols to index all the attestation data into a graph DB, so that they can run compute locally.
{% endtab %}

{% tab title="Indexer" %}
A valuable contribution to the project woudl be an open source indexer that would work as an alternative to the subgraph that we currently use.  This would run on a server and would listen for events fired fron the attestation registry and record new attestations, schemas, portals etc. and index them into a graph DB or vecotr DB so that computationally intensive algorithms (such as ML algorithms) can be run over the data.
{% endtab %}
{% endtabs %}

