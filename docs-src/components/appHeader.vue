<template>
  <fvHeader
    type="smart"
    css-color="header"
    css-flex
    css-padding="md">
    <fvButton
      css-hidden-lg
      css-color="header"
      css-border="no"
      css-shadow="no"
      css-text-size="lg"
      fab
      @click.native="$root.sidebar = !$root.sidebar">
      <i class="fa fa-bars"></i>
    </fvButton>
    <span css-space-x="md" />
    <div css-grow>
      <h1 css-text-size="lg">
        {{$attrs.title}}
      </h1>
    </div>
    <span css-space-x="md" />
    <slot></slot>
    <span v-if="!$attrs.hide_github" css-space-x="md" />
    <fvButton
      v-if="!$attrs.hide_github"
      tag="a"
      :href="$root.githubRepo"
      target="_blank"
      css-color="header"
      css-border="no"
      css-shadow="no">
      <i class="fa fa-github"></i> GITHUB
    </fvButton>
  </fvHeader>
</template>