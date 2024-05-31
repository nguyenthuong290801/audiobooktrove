<template>
    <div class="max-w-6xl mx-auto mt-10">
        <div class="text-white text-xl font-semibold mb-4">
            Frequently Asked Questions
        </div>
        <Accordion :activeIndex="0">
            <AccordionTab v-for="tab in tabs" :key="tab.title" :header="tab.title">
                <p class="m-0">{{ tab.content }}</p>
            </AccordionTab>
        </Accordion>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const tabs = ref([
    { title: 'How does the free trial work?', content: "Audible is a membership service that provides customers with the world's largest selection of audiobooks as well as podcasts, exclusive originals and more. Your Audible membership is free for 30 days. If you enjoy your Audible trial, do nothing and your membership will automatically continue. We'll send you an email reminder before your trial ends. Download the free Audible app to start listening on your iOS or Android device. You can also listen on any Alexa-enabled device, compatible Fire tablets, Kindles, Sonos devices and more. You can cancel anytime before your trial ends and you won’t be charged. There are no commitments and no cancellation fees." },
    { title: 'How much does Audible cost?', content: 'Content 2' },
    { title: 'What is included with my Audible membership?', content: 'Content 3' }
]);
</script>
