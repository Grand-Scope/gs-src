<script>
    import { onMount } from 'svelte';
    
    let container;
    let scrollY = 0;
    
    function updateScroll() {
        scrollY = window.scrollY;
        requestAnimationFrame(updateScroll);
    }
    
    onMount(() => {
        requestAnimationFrame(updateScroll);
    });

    $: skew = Math.min(Math.max((scrollY * 0.05), -5), 5); // Simple velocity fake or just scroll based skew
    // Ideally we want velocity. Let's stick to a constant skew like design or a slight reaction.
    // Design had -skew-y-2. Let's make it dynamic?
    // User requested "Scroll speed integration?".
    
    let lastScrollY = 0;
    let velocity = 0;
    let rafId;

    function animate() {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;
        velocity = delta * 0.1; // sensitivity
        // Clamp velocity
        velocity = Math.min(Math.max(velocity, -5), 5);
        
        lastScrollY = currentScrollY;
        rafId = requestAnimationFrame(animate);
    }

    onMount(() => {
        animate();
        return () => cancelAnimationFrame(rafId);
    });
</script>

<section class="bg-black py-16 overflow-hidden relative z-30" style="transform: skewY({-2 + velocity}deg); margin-top: -2px;">
    <div style="transform: skewY(2deg);">
        <!-- Row 1: Orange text -->
        <div class="flex whitespace-nowrap animate-marquee-left mb-4">
            <div class="flex items-center gap-16 px-8">
                <span class="font-display text-[10vw] text-orange">CHASE THE IMPOSSIBLE</span>
                <span class="font-display text-[10vw] text-orange opacity-40">•</span>
                <span class="font-display text-[10vw] text-orange">AI INTEGRATION</span>
                <span class="font-display text-[10vw] text-orange opacity-40">•</span>
                <span class="font-display text-[10vw] text-orange">BRAND STRATEGY</span>
                <span class="font-display text-[10vw] text-orange opacity-40">•</span>
            </div>
            <div class="flex items-center gap-16 px-8">
                <span class="font-display text-[10vw] text-orange">CHASE THE IMPOSSIBLE</span>
                <span class="font-display text-[10vw] text-orange opacity-40">•</span>
                <span class="font-display text-[10vw] text-orange">AI INTEGRATION</span>
                <span class="font-display text-[10vw] text-orange opacity-40">•</span>
                <span class="font-display text-[10vw] text-orange">BRAND STRATEGY</span>
                <span class="font-display text-[10vw] text-orange opacity-40">•</span>
            </div>
        </div>
        <!-- Row 2: White text, reverse -->
        <div class="flex whitespace-nowrap animate-marquee-right">
            <div class="flex items-center gap-16 px-8">
                <span class="font-display text-[5vw] text-white/80">CONTENT PRODUCTION</span>
                <span class="font-display text-[5vw] text-white/30">•</span>
                <span class="font-display text-[5vw] text-white/80">WEB DEVELOPMENT</span>
                <span class="font-display text-[5vw] text-white/30">•</span>
                <span class="font-display text-[5vw] text-white/80">DATA & AUTOMATION</span>
                <span class="font-display text-[5vw] text-white/30">•</span>
            </div>
            <div class="flex items-center gap-16 px-8">
                <span class="font-display text-[5vw] text-white/80">CONTENT PRODUCTION</span>
                <span class="font-display text-[5vw] text-white/30">•</span>
                <span class="font-display text-[5vw] text-white/80">WEB DEVELOPMENT</span>
                <span class="font-display text-[5vw] text-white/30">•</span>
                <span class="font-display text-[5vw] text-white/80">DATA & AUTOMATION</span>
                <span class="font-display text-[5vw] text-white/30">•</span>
            </div>
        </div>
    </div>
</section>
