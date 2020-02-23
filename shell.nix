with import <nixpkgs> {};

(let
  python = let
    packageOverrides = self: super: {
      promise = self.callPackage ./nix/promise/default.nix {};
      aniso8601 = self.callPackage ./nix/aniso8601/default.nix {};
      graphql-core = self.callPackage ./nix/graphql-core/default.nix {};
      graphql-relay = self.callPackage ./nix/graphql-relay/default.nix {};
      graphql-server-core = self.callPackage ./nix/graphql-server-core/default.nix {};
      graphene-sqlalchemy = self.callPackage ./nix/graphene-sqlalchemy/default.nix {};
      graphene-django = self.callPackage ./nix/graphene-django/default.nix {};
      python-graphene = self.callPackage ./nix/graphene/default.nix {};
      graphene = self.python-graphene;
      flask-graphql = self.callPackage ./nix/flask-graphql/default.nix {};
      pytest-runner = self.callPackage ./nix/pytest-runner/default.nix {};
    };
  in pkgs.python37.override {inherit packageOverrides; self = python;};

in python.withPackages(ps: with ps;
[
  ipython
  ipdb
  python-graphene
  flask
  flask-socketio
  graphene-sqlalchemy
  flask-graphql
  flask-cors
  #django
  #graphene-django
  psycopg2
  #django-cors-headers
  #django-filter
  sqlalchemy
  numpy
  requests
])).env
