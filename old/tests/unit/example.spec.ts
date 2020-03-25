import { shallowMount } from '@vue/test-utils'
import New from '@/views/New.vue'

describe('New.vue', () => {
    it('renders props.msg when passed', () => {
        const _wrapper = shallowMount(New, {
        })
    // expect(wrapper.text()).toMatch(msg)
    })
})
